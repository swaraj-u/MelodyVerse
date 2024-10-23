import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import { BACKEND_URL } from '../util/constants';
import { useData } from '../util/contextFile';
import { authUser } from '../util/authUser';
import { useParams} from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const {setIsLoggedIn} = useData();
  const {id} = useParams();
  const [ currentuser, setUser ] = useState({});

  useEffect(() => {
    const Userdata = async (id) => {
      try{
        const response = await axios.post(BACKEND_URL+'/userdata',{_id:id});
        if(response.status === 200){
          const user = response.data.user;
          setUser(user);
        }
      }catch(err){
        if(err.response){
          console.log(err.response.data);
        }else{
          console.log("Error: ", err.message);
        }
      }
    }
    Userdata(id);
  },[id])

  const logoutFunction = async() => {
    try{
      const response = await axios.get(BACKEND_URL+'/logout',{withCredentials:true} );
      if(response.status === 200){
        const loggedIn = await authUser();
        setIsLoggedIn(loggedIn);
      }
    }catch(err){
      if(err.response){
        console.log(err.response.data);
      }else{
        console.log("Error: ", err.message);
      }
    }

  }

  return (
    <Box w={"100vw"} h={"100vh"} boxSizing='border-box'>
      <Flex w={"100%"} h={'100%'}>
        <Flex as="aside" flexDirection={'column'} justifyContent={'space-between'} w={{base:"35vw", md:"30vw"}} h={'100vh'} bgColor={'gray.600'} flexGrow={0} boxSizing='border-box' p={"8"}>
        <Flex flexDirection={'column'}>
          <Heading as="h3" fontWeight={"thin"} color={"white"} fontSize={"3xl"}>Hello, <Text as="span" whiteSpace={'nowrap'} fontWeight={"bold"} color={"white"} fontSize={{base:'xl', md:'2xl'}}>{currentuser.username}</Text></Heading>
          </Flex>
          <Flex gap={1}>
           <Button onClick={logoutFunction}><Text>Logout</Text></Button>
           </Flex>
        </Flex>
        <Flex direction={'column'} w={"100%"} h={'100%'}>
          <Flex as="nav" w={"100%"} h={'60px'} padding={'4'} flexFlow={0} bgColor={'gray.500'} justifyContent={"center"} alignItems={"center"}>
          </Flex>
          <Box as="main" w={"100%"} h={"100%"} bgColor={'gray.400'}>
            <Outlet/>
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}
