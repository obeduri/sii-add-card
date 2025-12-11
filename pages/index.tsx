import 'react-credit-cards-2/dist/es/styles-compiled.css'

import { Box, Button, HStack, Heading, Input, Text, VStack } from "@chakra-ui/react"
import Cards, { Focused } from 'react-credit-cards-2'
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from "@chakra-ui/react"
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react"

import CreditCard from "@/components/CreditCard";
import { LiaEditSolid } from "react-icons/lia";
import Swal from 'sweetalert2'
import { Tooltip } from "@/components/Tooltip";

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
  const isInitialMount = useRef(true);

  // Load cards from localStorage on mount (client-side only)
  useEffect(() => {
    if (isInitialMount.current) {
      const storedCards = localStorage.getItem("creditCards");
      if (storedCards) {
        // eslint-disable-next-line
        setCards(JSON.parse(storedCards));
      }
      isInitialMount.current = false;
    } else {
      // Save cards to localStorage whenever they change (after initial load)
      localStorage.setItem("creditCards", JSON.stringify(cards));
    }
  }, [cards]);

  const addCard = () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (editingId) {
      // Update existing card
      setCards(cards.map(card =>
        card.id === editingId
          ? { ...card, cardNumber, cardHolder, expiryDate, cvv }
          : card
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
      // Add new card
      const newCard: CreditCard = {
        id: Date.now().toString(),
        cardNumber,
        cardHolder,
        expiryDate,
        cvv,
      };

      setCards([...cards, newCard]);

      Swal.fire({
        icon: 'success',
        title: '¡Tarjeta agregada!',
        text: 'La tarjeta se ha guardado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    }

    // Clear form
    setCardNumber("");
    setCardHolder("");
    setExpiryDate("");
    setCvv("");
    setIsModalOpen(false);
  };

  const deleteCard = (id: string) => {
    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar tarjeta?',
      text: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        setCards(cards.filter(card => card.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Eliminada',
          text: 'La tarjeta ha sido eliminada',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const editCard = (card: CreditCard) => {
    setCardNumber(card.cardNumber);
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiryDate(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvv(cleaned);
  };

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <HStack justify="space-between" mb={6}>
        <Heading>Gestor de Tarjetas de Crédito</Heading>
        <DrawerRoot open={isModalOpen} onOpenChange={(e) => setIsModalOpen(e.open)} placement="bottom">
          <DrawerTrigger asChild>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => {
                setEditingId(null);
                setCardNumber("");
                setCardHolder("");
                setExpiryDate("");
                setCvv("");
              }}
            >
              <FaPlus />
              <Text ml={2}>Agregar Tarjeta</Text>
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
                  />
                </Box>

                <Box width="100%">
                  <Text mb={2} fontWeight="medium">Nombre del Titular</Text>
                  <Input
                    placeholder="Juan Pérez"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    onFocus={() => setFocus('name')}
                  />
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
                    />
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
                    />
                  </Box>
                </HStack>
              </VStack>
            </DrawerBody>
            <DrawerFooter>
              <HStack width="100%" gap={2}>
                <Button colorScheme="gray" onClick={cancelEdit} width="50%">
                  Cancelar
                </Button>
                <Button colorScheme="blue" onClick={addCard} width="50%">
                  {editingId ? 'Guardar Cambios' : 'Agregar Tarjeta'}
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
          {cards.length === 0 ? (
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
                    number={card.cardNumber}
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