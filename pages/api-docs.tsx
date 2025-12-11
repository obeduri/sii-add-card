import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import styles from '../styles/swagger.module.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return (
    <div className={styles.container}>
      <SwaggerUI url="/openapi.json" />
    </div>
  );
}
