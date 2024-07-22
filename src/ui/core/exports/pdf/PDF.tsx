import React from 'react';
import userLogo from './userpdf.png'

import { Document, Text, Page, Image, StyleSheet, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    size: 'A4',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  table: {
    width: 'auto', // Adjust width as needed for each table
    borderColor: '#000', // Ensures borders are drawn between cells
    border: '1px solid black', // Black bottom border for each row
    marginTop: 20,
    marginRight: 20,
  },
  tablaFila:{
    margin: 'auto',
    flexDirection: 'row',
  },

  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    padding: '10px', // Added space around text
    backgroundColor: '#eee', // Light gray background for header
    fontSize: 12, // Adjust header font size
    fontWeight: 'bold',
    borderBottom: '1px solid black', // Black bottom border
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: '10px', // Added space around text
    borderBottom: '1px solid black', // Black bottom border for each row
  },
  tableCell: {
    fontSize: 10, // Adjust cell content font size
    textAlign: 'center', 
    marginRight: '10px', // Add space between cells
  },
  image: {
    width: '40px',
    alignItems: 'center',
  },
  title: {
    // flexDirection: 'col',
    textAlign: 'center',
    margin: 10,
    padding: 10,
    fontSize: '20',
  },
  tablesContainer: {
    display: 'flex',
    // flexDirection: 'col', // Arrange tables side by side
    justifyContent: 'space-between', // Distribute space evenly between tables
  },
});

const data = [
    { name: 'John', lastname: 'Doe', email: 'jondoe@email.com', days: 7, info: 'Additional Information' },
  ];
  
  const locationData = [
    { estado: 'Miranda', municipio: 'Libertador', parroquia: 'El Recreo', sector: 'Centro', calle: 'Cuatro',},
  ];
  
  const characteristicsData = [
    { weight: 70, height: 175, hairColor: 'Castaño', eyeColor: 'Azul' },
  ];

function PDF() {
    return (
        <Document >
          <Page  style={styles.page}>
            <Text style={styles.title}>Usuario registrado exitosamente!</Text>
            <Image style={styles.image} src={userLogo} />
            <View style={styles.tablesContainer}>
            {/* User Information Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Nombre</Text>
                <Text style={styles.tableCell}>Apellido</Text>
                <Text style={styles.tableCell}>Email</Text>
                <Text style={styles.tableCell}>Dias</Text>
                <Text style={styles.tableCell}>Informacion</Text>
              </View>
              {data.map((row, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{row.name}</Text>
                  <Text style={styles.tableCell}>{row.lastname}</Text>
                  <Text style={styles.tableCell}>{row.email}</Text>
                  <Text style={styles.tableCell}>{row.days}</Text>
                  <Text style={styles.tableCell}>{row.info}</Text>
                </View>
              ))}
            </View>
      
            {/* Location Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Estado</Text>
                <Text style={styles.tableCell}>Municipio</Text>
                <Text style={styles.tableCell}>Parroquia</Text>
                <Text style={styles.tableCell}>Sector</Text>
                <Text style={styles.tableCell}>Calle</Text>
              </View>
              {locationData.map((row, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{row.estado}</Text>
                  <Text style={styles.tableCell}>{row.municipio}</Text>
                  <Text style={styles.tableCell}>{row.parroquia}</Text>
                  <Text style={styles.tableCell}>{row.sector}</Text>
                  <Text style={styles.tableCell}>{row.calle}</Text>
                </View>
              ))}
            </View>
      
            {/* Characteristics Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Peso (kg)</Text>
                <Text style={styles.tableCell}>Altura (cm)</Text>
                <Text style={styles.tableCell}>Color de Cabello</Text>
                <Text style={styles.tableCell}>Color de Ojos</Text>
              </View>
              {characteristicsData.map((row, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{row.weight}</Text>
                  <Text style={styles.tableCell}>{row.height}</Text>
                  <Text style={styles.tableCell}>{row.hairColor}</Text>
                  <Text style={styles.tableCell}>{row.eyeColor}</Text>
                </View>
              ))}
            </View>
            </View>
          </Page>
        </Document>
      );
}

export default PDF;
