import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** custom hook */
export default function useFetch(query) {
   const [getData, setData] = useState({
      isLoading: true,  // Set initial state to loading
      apiData: undefined,
      status: null,
      serverError: null
   });

   useEffect(() => {
      const fetchData = async () => {
         try {
            const { username } = !query ? await getUsername() : {};

            const response = await axios.get(
               !query ? `/api/user/${username}` : `/api/${query}`
            );
            const { data, status } = response;
            console.log(data)

            if (status === 200) {
               setData({
                  isLoading: false,
                  apiData: data,
                  status: status,
                  serverError: null
               });
            }
         } catch (error) {
            setData({
               isLoading: false,
               apiData: undefined,
               status: null,
               serverError: error
            });
         } finally {
            setData(prev => ({ ...prev, isLoading: false })); // Ensure loading is set to false in all cases
         }
      };

      fetchData();
   }, [query]);

   return [getData, setData];
}
