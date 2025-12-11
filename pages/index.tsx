import 'react-credit-cards-2/dist/es/styles-compiled.css'

import { Alert, Box, Button, HStack, Heading, Input, Spinner, Text, VStack } from "@chakra-ui/react"
import Cards, { Focused } from 'react-credit-cards-2'
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from "@chakra-ui/react"
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { useCallback, useEffect, useMemo, useState } from "react"

import CreditCard from "@/components/CreditCard";
import { LiaEditSolid } from "react-icons/lia";
import Swal from 'sweetalert2'
import { Tooltip } from "@/components/Tooltip";
import axios from 'axios'

interface CreditCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const Home = () => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [focus, setFocus] = useState<Focused | undefined>(undefined);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Errores de validación
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: ""
  });

  const Toast = useMemo(() => Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  }), []);

  const fetchCards = useCallback(async () => {
    try {
      setInitialLoading(true);
      const response = await axios.get('/api/cards');
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
      Toast.fire({
        icon: "error",
        title: "Error al cargar las tarjetas"
      });
    } finally {
      setInitialLoading(false);
    }
  }, [Toast]);

  // Cargar tarjetas desde la API al montar
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Funciones de validación
  const validateCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    if (!cleaned) return "El número de tarjeta es requerido";
    if (!/^\d+$/.test(cleaned)) return "El número de tarjeta solo puede contener números";
    if (cleaned.length !== 16) return "El número de tarjeta debe tener 16 dígitos";
    return "";
  };

  const validateCardHolder = (value: string): string => {
    if (!value.trim()) return "El nombre del titular es requerido";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) return "El nombre solo puede contener letras y letras con tildes";
    if (value.length > 20) return "El nombre no puede exceder 20 caracteres";
    return "";
  };

  const validateExpiryDate = (value: string): string => {
    if (!value) return "La fecha de vencimiento es requerida";
    if (!/^\d{2}\/\d{2}$/.test(value)) return "El formato debe ser MM/YY";

    const [month, year] = value.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const maxYear = currentYear + 5;

    if (month < 1 || month > 12) return "El mes debe estar entre 01 y 12";
    if (year < 25) return "El año no puede ser menor a 2025";
    if (year > maxYear) return `El año no puede ser mayor a ${maxYear}`;

    // Verificar si la tarjeta está vencida
    const currentMonth = new Date().getMonth() + 1;
    if (year === currentYear && month < currentMonth) {
      return "La tarjeta está vencida";
    }

    return "";
  };

  const validateCvv = (value: string): string => {
    if (!value) return "El CVV es requerido";
    if (!/^\d{3,4}$/.test(value)) return "El CVV debe tener 3 o 4 dígitos";
    return "";
  };

  const validateAllFields = (): boolean => {
    const newErrors = {
      cardNumber: validateCardNumber(cardNumber),
      cardHolder: validateCardHolder(cardHolder),
      expiryDate: validateExpiryDate(expiryDate),
      cvv: validateCvv(cvv)
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== "");
  };

  const addCard = async () => {
    if (!validateAllFields()) {
      Swal.fire({
        icon: 'error',
        title: 'Campos inválidos',
        text: 'Por favor corrige los errores en el formulario',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        // Actualizar tarjeta existente
        const response = await axios.put(`/api/cards/${editingId}`, {
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardHolder,
          expiryDate,
          cvv,
        });

        setCards(cards.map(card =>
          card.id === editingId ? response.data : card
        ));

        Swal.fire({
          icon: 'success',
          title: '¡Tarjeta actualizada!',
          text: 'Los cambios se han guardado correctamente',
          timer: 2000,
          showConfirmButton: false
        });

        setEditingId(null);
      } else {
        // Agregar nueva tarjeta
        const response = await axios.post('/api/cards', {
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardHolder,
          expiryDate,
          cvv,
        });

        setCards([...cards, response.data]);

        Swal.fire({
          icon: 'success',
          title: '¡Tarjeta agregada!',
          text: 'La tarjeta se ha guardado correctamente',
          timer: 2000,
          showConfirmButton: false
        });
      }

      // Limpiar formulario
      setCardNumber("");
      setCardHolder("");
      setExpiryDate("");
      setCvv("");
      setErrors({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving card:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la tarjeta. Por favor intenta de nuevo.',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (id: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar tarjeta?',
      text: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#FA6868',
      cancelButtonColor: '#cecece'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/cards/${id}`);
        setCards(cards.filter(card => card.id !== id));
        Toast.fire({
          icon: "success",
          title: "Tarjeta eliminada"
        });
      } catch (error) {
        console.error('Error deleting card:', error);
        Toast.fire({
          icon: "error",
          title: "Error al eliminar la tarjeta"
        });
      }
    }
  };

  const editCard = (card: CreditCard) => {
    // Formatear número de tarjeta con espacios para mostrar
    setCardNumber(formatCardNumber(card.cardNumber));
    setCardHolder(card.cardHolder);
    setExpiryDate(card.expiryDate);
    setCvv(card.cvv);
    setEditingId(card.id);
    setIsModalOpen(true);
  };

  const cancelEdit = () => {
    setCardNumber("");
    setCardHolder("");
    setExpiryDate("");
    setCvv("");
    setErrors({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const maskCardNumber = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length !== 16) return cardNumber;

    const firstTwo = cleaned.substring(0, 2);
    const lastFour = cleaned.substring(12, 16);
    const masked = firstTwo + '**********' + lastFour;

    return masked;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (cleaned.length <= 16) {
      const formatted = formatCardNumber(e.target.value);
      setCardNumber(formatted);
      setErrors(prev => ({ ...prev, cardNumber: validateCardNumber(formatted) }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiryDate(formatted);
    if (formatted.length === 5) {
      setErrors(prev => ({ ...prev, expiryDate: validateExpiryDate(formatted) }));
    } else {
      setErrors(prev => ({ ...prev, expiryDate: "" }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvv(cleaned);
    setErrors(prev => ({ ...prev, cvv: validateCvv(cleaned) }));
  };

  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir letras, espacios y caracteres con tilde
    const filtered = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    if (filtered.length <= 20) {
      setCardHolder(filtered);
      setErrors(prev => ({ ...prev, cardHolder: validateCardHolder(filtered) }));
    }
  };

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <Box mb={6} textAlign={{ base: "left", md: "center", sm: "center" }}>
        <Heading>Gestor de Tarjetas de Crédito</Heading>
      </Box>
      <Box>
        <Alert.Root status="warning">
          <Alert.Indicator />
          <Alert.Title>
            Esta es una demostración, con una base de datos real y compartida de manera pública por favor no utilices datos reales
          </Alert.Title>
        </Alert.Root>
      </Box>
      <HStack justify="space-between" mb={6}>
        <DrawerRoot open={isModalOpen} onOpenChange={(e) => setIsModalOpen(e.open)} placement="bottom">
          <DrawerTrigger asChild>
            <Button
              size="lg"
              w="72px"
              h="72px"
              borderRadius="full"
              position="fixed"
              bottom="24px"
              right="24px"
              zIndex={1000}
              onClick={() => {
                setEditingId(null);
                setCardNumber("");
                setCardHolder("");
                setExpiryDate("");
                setCvv("");
                setErrors({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });
              }}
            >
              <Tooltip content="Agregar Tarjeta">
                <FaPlus />
              </Tooltip>
            </Button>
          </DrawerTrigger>
          <DrawerBackdrop />
          <DrawerContent
            position="fixed"
            bottom={0}
            left="50%"
            transform="translateX(-50%)"
            width={{ base: "100%", md: "50%" }}
            maxW="720px"
            maxH="80vh"
            borderTopRadius="xl"
            overflow="auto"
          >
            <DrawerHeader>
              <DrawerTitle>
                {editingId ? 'Editar Tarjeta' : 'Agregar Nueva Tarjeta'}
              </DrawerTitle>
            </DrawerHeader>
            <DrawerCloseTrigger />
            <DrawerBody>
              <VStack gap={4}>
                <Box mb={4} display="flex" justifyContent="center" width="100%">
                  <Cards
                    number={cardNumber}
                    expiry={expiryDate}
                    cvc={cvv}
                    name={cardHolder}
                    focused={focus}
                  />
                </Box>

                <Box width="100%">
                  <Text mb={2} fontWeight="medium">Número de Tarjeta</Text>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    onFocus={() => setFocus('number')}
                    maxLength={19}
                    borderColor={errors.cardNumber ? "red.500" : undefined}
                  />
                  {errors.cardNumber && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.cardNumber}
                    </Text>
                  )}
                </Box>

                <Box width="100%">
                  <Text mb={2} fontWeight="medium">Nombre del Titular</Text>
                  <Input
                    placeholder="Juan Pérez"
                    value={cardHolder}
                    onChange={handleCardHolderChange}
                    onFocus={() => setFocus('name')}
                    maxLength={20}
                    borderColor={errors.cardHolder ? "red.500" : undefined}
                  />
                  {errors.cardHolder && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.cardHolder}
                    </Text>
                  )}
                </Box>

                <HStack width="100%">
                  <Box width="100%">
                    <Text mb={2} fontWeight="medium">Fecha de Vencimiento</Text>
                    <Input
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      onFocus={() => setFocus('expiry')}
                      maxLength={5}
                      borderColor={errors.expiryDate ? "red.500" : undefined}
                    />
                    {errors.expiryDate && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.expiryDate}
                      </Text>
                    )}
                  </Box>

                  <Box width="100%">
                    <Text mb={2} fontWeight="medium">CVV</Text>
                    <Input
                      placeholder="123"
                      value={cvv}
                      onChange={handleCvvChange}
                      onFocus={() => setFocus('cvc')}
                      maxLength={4}
                      type="password"
                      borderColor={errors.cvv ? "red.500" : undefined}
                    />
                    {errors.cvv && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.cvv}
                      </Text>
                    )}
                  </Box>
                </HStack>
              </VStack>
            </DrawerBody>
            <DrawerFooter>
              <HStack width="100%" gap={2}>
                <Button bg="gray" onClick={cancelEdit} width="50%" disabled={loading}>
                  Cancelar
                </Button>
                <Button bg="#5A9CB5" onClick={addCard} width="50%" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : (editingId ? 'Guardar Cambios' : 'Agregar Tarjeta')}
                </Button>
              </HStack>
            </DrawerFooter>
          </DrawerContent>
        </DrawerRoot>
      </HStack>

      <VStack gap={6} align="stretch">
        {/* Lista de Tarjetas */}
        <Box>
          <Heading size="md" mb={4}>Tus Tarjetas ({cards.length})</Heading>
          {initialLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <Spinner size="xl" />
            </Box>
          ) : cards.length === 0 ? (
            <Text color="gray.500">No hay tarjetas agregadas aún</Text>
          ) : (
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
              gap={6}
            >
              {cards.map((card) => (
                <Box
                  key={card.id}
                  position="relative"
                  css={{
                    '& .card-actions': {
                      opacity: 0,
                      transition: 'opacity 0.2s ease-in-out'
                    },
                    '&:hover .card-actions': {
                      opacity: 1
                    }
                  }}
                >
                  <Cards
                    number={maskCardNumber(card.cardNumber)}
                    expiry={card.expiryDate}
                    cvc={card.cvv}
                    name={card.cardHolder}
                    focused={undefined}
                  />
                  <Box className="card-actions">
                    <Tooltip
                      content="Eliminar"
                      showArrow
                      portalled
                      positioning={{ placement: "top" }}
                    >
                      <Box
                        bg="#FA6868"
                        color="white"
                        borderRadius="full"
                        width="40px"
                        height="40px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => deleteCard(card.id)}
                        position="absolute"
                        top={-4}
                        right={4}
                        zIndex={10}
                        cursor="pointer"
                        _hover={{ bg: "red.500" }}
                      >
                        <FaRegTrashAlt />
                      </Box>
                    </Tooltip>
                    <Tooltip
                      content="Editar"
                      showArrow
                      portalled
                      positioning={{ placement: "top" }}
                    >
                      <Box
                        bg="#face68"
                        color="white"
                        borderRadius="full"
                        width="40px"
                        height="40px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => editCard(card)}
                        position="absolute"
                        top={-4}
                        right={16}
                        zIndex={10}
                        cursor="pointer"
                        _hover={{ bg: "#ccaf53" }}
                      >
                        <LiaEditSolid size={20} />
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
}

export default Home;