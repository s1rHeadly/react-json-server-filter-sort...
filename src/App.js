
import React, {useState, useEffect, useCallback} from 'react';
import {MDBTableHead,MDBTableBody,MDBRow,MDBCol,MDBContainer,MDBTable, MDBSpinner, MDBBtn, MDBBtnGroup, MDBPagination, MDBPaginationItem, MDBPaginationLink} from 'mdb-react-ui-kit';



const App = () => {


  // state
  const [data, setData] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState('');
  const [sortValue, setSortValue] = useState('');

  const sortOptions = ["name", "email", "phone", "address", "id", "status"];

  // get initial data function
  const loadUserData = useCallback(async (url, start, end) => {

    setIsPending(true);

    try {

        const response = await fetch(url)

        if (!response.ok) {
            setError('Something went wrong, no posts have been loaded')

        }
        const result = await response.json();

        setTimeout(() => {
          setData(result);
          setIsPending(false);
        }, 1000)


    } catch (error) {
        setError(error)
        setIsPending(true)
        console.log(error)
    }


}, []); 



// set useEffect for the initial load
  useEffect((url, start, end) => {
   loadUserData(`http://localhost:8000/users?_start=${0}&_end=${4}`);
  }, [loadUserData]);

  



// function for reset button
  const handleReset = (url, start, end) => {
    setValue('');
    loadUserData(`http://localhost:8000/users?_start=${0}&_end=${4}`);
  
  }




// submit function for the form
  const handleSearch = async(e) => {
    e.preventDefault();
    try {

      const response = await fetch(`http://localhost:8000/users?q=${value}`);
      const result = await response.json();
      setData(result);

      if(!result){
       setError('no data found')
      }
      
    } catch (error) {
        console.log(error)
    }
  }




 // sortorder by select field
  const handleSort = async(e) => {
  
    try {
      let value = e.target.value;
      setSortValue(value);
      const response = await fetch(`http://localhost:8000/users?_sort=${value}&_order=asc`);
      const result = await response.json();
      setData(result);
      
    } catch (error) {
        console.log(error)
    }
  }


  const handleFilter = async(status) => {

    try {
      const response = await fetch(`http://localhost:8000/users?status=${status}`);
      const result = await response.json();
      setData(result)

    } catch (error) {
        console.log(error)
    }
  }
  


  return (
  
    <MDBContainer>
  
        <MDBRow style={{marginTop: '50px'}}>
          <MDBCol size="12" className='text-center'>
            <form className='search-form' onSubmit={handleSearch}>
              <input type="text" className="form-control" placeholder='search name...' value={value} onChange={(e) => setValue(e.target.value)}/>
              <MDBBtn type="submit" color='dark'>Search</MDBBtn>
              <MDBBtn color='danger' className="mx-2" onClick={handleReset}>Reset</MDBBtn>
            </form>
          </MDBCol>
        </MDBRow>


        <MDBRow>
          <MDBCol size="12">
          <h2 className='text-center'>Search, Filter, Sort and Pagination with Fake Rest API / MDB React</h2>
          </MDBCol>
        </MDBRow>


         
         <MDBRow>
           <MDBCol size="12">
           <MDBTable striped>

             <MDBTableHead dark>
                 <tr>
                   <th scope='col'>No.</th>
                   <th scope='col'>Name</th>
                   <th scope='col'>Email</th>
                   <th scope='col'>Address</th>
                   <th scope='col'>Phone</th>
                   <th scope='col'>Status</th>
                 </tr>
             </MDBTableHead>
           
          {error && <p>{error}</p>}

              {!isPending && data.length > 0 ? (
                      data.map((user, index) => (
                        <MDBTableBody key={index}>
                        <tr>
                        <th scope='row'>{index + 1}</th>
                        <th>{user.name}</th>
                        <th>{user.email}</th>
                        <th>{user.address}</th>
                        <th>{user.phone}</th>
                        <th>{user.status}</th>
                        </tr>
                        </MDBTableBody>
                      ))

              ) : (
                <MDBTableBody className='spinner'>
                     <tr>
                     <th scope='col'>
                       <MDBSpinner/>
                     </th>
                   </tr>
                 
                 </MDBTableBody>
              )}
              
           </MDBTable>
           </MDBCol>
         </MDBRow>


         <MDBRow style={{marginTop: '50px'}}>
          <MDBCol size="12" className='text-center'>
            
          </MDBCol>
        </MDBRow>





        <MDBRow style={{marginTop: "50px", marginBottom: "100px"}}>
        <MDBCol size='8'>
         <h5>Sort by:</h5>
         <select value={sortValue} onChange={handleSort}>
               <option>Please select value</option>
               {
                 sortOptions.map((item, index) => ( <option value={item} key={index}>{item}</option>))
               }
        </select>
        </MDBCol>

        <MDBCol size='4' className='col-example'>
        <h5>Filter by Status:</h5>
        <MDBBtnGroup>
        <MDBBtn color='success' onClick={() => handleFilter('active')}>Active</MDBBtn>
        <MDBBtn color='danger' onClick={() => handleFilter('inactive')}>Inactive</MDBBtn>
        </MDBBtnGroup>
        </MDBCol>
      </MDBRow>

    </MDBContainer>
       
  );
}

export default App;
