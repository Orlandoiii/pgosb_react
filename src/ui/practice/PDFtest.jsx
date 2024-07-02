import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontSize: 12, textAlign: 'left',
  },
  section: {
    marginLeft: 25, marginRight: 25, marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'gray', 
    borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px',
  },
  tittle: {
    fontSize: 20, width: '100%', marginBottom: 15, marginTop: 15, textAlign: 'center', display: 'flex', justifyContent: 'center',
  },
  header: {
    fontSize: 16, fontWeight: 'bold', marginBottom: 5,
  },
  label: {
    fontWeight: 'bold', marginRight: 5,
  },
  table: {
    display: 'flex', flexDirection: 'row', width: 'auto', borderStyle: 'solid', borderColor: 'gray', borderWidth: 1,
  },
  tableHeader: {
    display: 'block',
    backgroundColor: 'lightgray',
    padding: 3,
     flex: 1,

  },
  tableHeaderCell: {
    display: 'table-cell',
    padding: 3,
    fontWeight: 'bold',
    flex: 1,
  },
  tableCell: {
    display: 'table-cell',
    padding: 3,
    borderColor: 'gray',
    flex: 1,
  },
});

const userData = {
  userName: "Jondoe",
  firstName: "Jon", 
  lastName: "Doe", 
  email: "jondoe@email.com",
  phoneNumber: "0424-1234567",
  
  sector: "Altagracia", 
  urbanizacion: "Los Palos Grandes",
  direccion: "Segunda transversal con cuarta Av.",
  officeLocation: "Miranda",

  height: "1.70cm",
  weight: "80kg",
  bloodType: "A+",
  shirtSize: "L",
  pantSize: "M",
  shoesSize: "41",

  code: "457 ", 
  inDate: "24-09-2013", 
  outDate: "--", 
  rank: "Superior",  
  institution: "Principal",  
  isSystemUser: "Si", 
  profesion: "FireFighter", 
  rol: "Activo", 
  division: "7", 
};

const DatosBasicos = ({ userName, firstName, lastName, phoneNumber, email }) => (
  <View style={styles.section}>
    <Text style={styles.header}>Datos Básicos</Text>
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <View style={styles.tableHeaderCell}><Text>Nombre de Usuario:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Email:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Nombre:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Apellido:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Teléfono:</Text></View>
      </View>
      <View style={styles.tableCell}>
        <Text>{userName || 'N/A'}</Text>
        <Text>{email || 'N/A'}</Text>
        <Text>{firstName || 'N/A'}</Text>
        <Text>{lastName || 'N/A'}</Text>
        <Text>{phoneNumber || 'N/A'}</Text>
      </View>
    </View>
  </View>
);

const Ubicacion = ({ sector, urbanizacion, direccion, officeLocation }) => (
  <View style={styles.section}>
    <Text style={styles.header}>Ubicación</Text>
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <View style={styles.tableHeaderCell}><Text>Sector:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Urbanización:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Dirección:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Sede:</Text></View>
      </View>
      <View style={styles.tableCell}>
        <Text>{sector || 'N/A'}</Text>
        <Text>{urbanizacion || 'N/A'}</Text>
        <Text>{direccion || 'N/A'}</Text>
        <Text>{officeLocation || 'N/A'}</Text>
      </View>
    </View>
  </View>
);

const Caracteristicas = ({ height, weight, bloodType, shirtSize, pantSize, shoesSize }) => (
  <View style={styles.section}>
    <Text style={styles.header}>Características</Text>
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <View style={styles.tableHeaderCell}><Text>Altura:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Peso:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Tipo de Sangre:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Talla de Camisa:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Talla de Pantalones:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Talla de Zapatos:</Text></View>
      </View>
      <View style={styles.tableCell}>
        <Text>{height || 'N/A'}</Text>
        <Text>{weight || 'N/A'}</Text>
        <Text>{bloodType || 'N/A'}</Text>
        <Text>{shirtSize || 'N/A'}</Text>
        <Text>{pantSize || 'N/A'}</Text>
        <Text>{shoesSize || 'N/A'}</Text>
      </View>
    </View>
  </View>
);

const OtrosDatos = ({ code, inDate, outDate, rank, institution, isSystemUser, profesion, rol, division }) => (
  <View style={styles.section}>
    <Text style={styles.header}>Datos Institucionales</Text>
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <View style={styles.tableHeaderCell}><Text>Código:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Fecha de Ingreso:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Fecha de Egreso:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Rango:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Institución:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Usuario del Sistema:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Profesión:</Text></View>
        <View style={styles.tableHeaderCell}><Text>Rol:</Text></View>
        <View style={styles.tableHeaderCell}><Text>División:</Text></View>
      </View>
      <View style={styles.tableCell}>
        <Text>{code || 'N/A'}</Text>
        <Text>{inDate || 'N/A'}</Text>
        <Text>{outDate || 'N/A'}</Text>
        <Text>{rank || 'N/A'}</Text>
        <Text>{institution || 'N/A'}</Text>
        <Text>{isSystemUser || 'N/A'}</Text>
        <Text>{profesion || 'N/A'}</Text>
        <Text>{rol || 'N/A'}</Text>
        <Text>{division || 'N/A'}</Text>
      </View>
    </View>
  </View>
);

const PDFtest = () => (
  <Document>
    <Page size="A4" style={styles.page}>

    <View style={styles.tittle}>
        <Text>Usuario registrado exitosamente!</Text>
      </View>

      <DatosBasicos
        userName={userData.userName}
        email={userData.email}
        firstName={userData.firstName}
        lastName={userData.lastName}
        phoneNumber={userData.phoneNumber}
      />
      <Ubicacion
        sector={userData.sector}
        urbanizacion={userData.urbanizacion}
        direccion={userData.direccion}
        officeLocation={userData.officeLocation}
      />
      <Caracteristicas
        height={userData.height}
        weight={userData.weight}
        bloodType={userData.bloodType}
        shirtSize={userData.shirtSize}
        pantSize={userData.pantSize}
        shoesSize={userData.shoesSize}
      />
      <OtrosDatos
        code={userData.code}
        inDate={userData.inDate}
        outDate={userData.outDate}
        rank={userData.rank}
        institution={userData.institution}
        isSystemUser={userData.isSystemUser}
        profesion={userData.profesion}
        rol={userData.rol}
        division={userData.division}
      />
    </Page>
  </Document>
);

export default PDFtest;
