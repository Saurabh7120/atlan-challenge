import { Button, Container, Flex, FormControl, FormLabel, Grid, GridItem, Select, Spinner, Text, Textarea, useToast} from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import axios from 'axios';
import Table from '../Components/table';

export default function Home() {

  const [query, setQuery] = useState('');
  const [allCols, setAllCols] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  

  

  useEffect(() => {
    const getTable = async() => {
      try {
        const {data} = await axios.get('https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/order_details.csv');
        let splitted = data.split('\n');
        console.log(splitted.slice(1,splitted.length));
        setAllCols(splitted[0].split(','))
        setAllRows(splitted.slice(1,splitted.length))
      } catch (error) {
        toast({title: 'Something went wrong while fetching data!', status: 'error', duration: 2000});
        console.log(error);
      }
    }
  
    getTable()
  },[])

  const handleSelect = e => {
    const {value} = e.target
    if(!value) return
    setQuery(value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    if(query.trim().length === 0) {
      toast({title: 'Please enter a query in the textArea', status: 'warning', duration: 2000});
      return;
    }
    setLoading(true);
    if(query.trim().length === 0) return
    let filtered = []
    switch (query) {
      case 'SELECT * FROM Orders WHERE discount > 0':
        setCols(allCols);
         filtered = allRows.filter(i => parseFloat(i.split(',')[4]) > 0);
        setRows(filtered)
        break;
      
      case 'SELECT productID, unitPrice FROM Orders WHERE discount > 0.15':
        setCols([allCols[1],allCols[2]])
        filtered = allRows.filter((i) => parseFloat(i.split(',')[4]) > 0.15)
        filtered = filtered.map((i) => [i.split(',')[1],i.split(',')[2]].join(','))
        setRows(filtered)
        break;
    
      default:
        setCols(allCols);
        setRows(allRows)
        break;
    }
    setLoading(false);
  }


  return <Container py={5} minW='70%'>
    <Text textAlign={'center'} fontSize={'2xl'} fontWeight='bold' mb={5}>Order data manager</Text>
    <Grid  templateColumns='repeat(2, 1fr)'>
      <GridItem p={5} textAlign='right'>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>Write a query</FormLabel>
            <Textarea 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder='type your query here'
              mb={2}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Select a predefined queries</FormLabel>
            <Select onChange={handleSelect} mb={2} placeholder="Select a query">
              <option value={'SELECT * FROM Orders WHERE discount > 0'}>{'SELECT * FROM Orders WHERE discount > 0'}</option>
              <option value={'SELECT productID, unitPrice FROM Orders WHERE discount > 0.15'}>{'SELECT productID, unitPrice FROM Orders WHERE discount > 0.15'}</option>
            </Select>
          </FormControl>
          <Button type='submit'>Submit</Button>
        </form>
      </GridItem>
      <GridItem p={5} minH='700px' borderLeft='1px solid #E2E2E2'>
        <Text textAlign={'left'}>See your results here:</Text>
        {loading ? <Flex mt='40%' justifyContent={'center'} flexWrap='wrap'>
            <Spinner/>
            <Text textAlign={'center'} w='100%'>Loading your results...</Text>
          </Flex> : 
          <Table cols={cols} rows={rows}/>
        }
      </GridItem>
    </Grid>
  </Container>
}
