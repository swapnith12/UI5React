import React, { useState, useEffect } from 'react';
import { Table, TableColumn, TableRow, TableCell, Input, Button } from "@ui5/webcomponents-react";

const ODATA_URL = "https://services.odata.org/v3/northwind/northwind.svc/Customers?$format=json";

interface Customer {
    CustomerID:String;
    CompanyName:String;
    ContactName :String;
    City : String;
}

const App = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(ODATA_URL);
        const data = await response.json();
        setCustomers(data.value);
      } catch (error) {
        console.error("Error fetching OData:", error);
      }
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Customer Information</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table style={{ marginTop: "20px" }}>
          <TableColumn>Customer ID</TableColumn>
          <TableColumn>Company Name</TableColumn>
          <TableColumn>Contact Name</TableColumn>
          <TableColumn>City</TableColumn>
          {customers.map((customer, index) => (
            <TableRow key={index}>
              <TableCell>{customer.CustomerID}</TableCell>
              <TableCell>{customer.CompanyName}</TableCell>
              <TableCell>{customer.ContactName}</TableCell>
              <TableCell>{customer.City}</TableCell>
            </TableRow>
          ))}
        </Table>
      )}
    </div>
  );
};

export default App;
