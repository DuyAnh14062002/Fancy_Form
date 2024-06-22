import React, { useEffect, useState } from "react";
import { Form} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import "./MainForm.scss";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function MainForm() {
  const [show, setShow] = useState(false)
  const [showConverted, setShowConverted] = useState(false)
  const [currencies, setCurrencies] = useState([])
  const [currenciesSearch, setCurrenciesSearch] = useState([])
  const [convertCurrency, setConvertCurrency] = useState({})
  const [convertedCurrency, setConvertedCurrency] = useState({})
  const [valueLeft, setValueLeft] = useState('');
  const [valueRight, setValueRight] = useState('');
  const [numberOfCurrencies, setNumberOfCurrencies] = useState(0)
  const handleShowModal = () => {
     setShow(true)
     setCurrencies(currenciesSearch)
  }
  const handleCloseModal = () => {
     setShow(false)
  }
  const handleShowConvered = () => {
    setShowConverted(true)
    setCurrencies(currenciesSearch)
  }
  const handleCloseConvered = () => {
    setShowConverted(false)
  }
  useEffect(() => {
     const loadingCurrency = async() => {
      let res = await axios.get("https://interview.switcheo.com/prices.json")
      if(res?.data){
        setCurrencies(res.data)
        setNumberOfCurrencies(res.data.length)
        setConvertCurrency(res.data[0])
        setConvertedCurrency(res.data[1])
        res?.data.forEach(item=>{
          iconFetch(item.currency)
        })
      }
     }
     loadingCurrency()
  }, [])
  const handleChooseCurrency = (item) => {
    setConvertCurrency(item)
    setValueRight((valueLeft * item.price)/ convertedCurrency.price  )
    handleCloseModal()
  }
  const handleChooseCurrencyConverted = (item) => {
     setConvertedCurrency(item)
     setValueRight((  valueLeft *  convertCurrency.price) / item.price  )
     handleCloseConvered()
  }

  const handleChangeCurrencyLeft = (e) => {
    const inputValue = e.target.value;
    setValueLeft(inputValue);
    setValueRight((inputValue * convertCurrency.price)/ convertedCurrency.price )
  };
  const handleChangeCurrencyRight = (e) => {
    const inputValue = e.target.value;
    setValueRight(inputValue);
    setValueLeft((inputValue * convertedCurrency.price)/ convertCurrency.price)
  };
  const handleKeyDown = (e) => {
    if (
      !/[0-9]/.test(e.key) && 
      e.key !== 'Backspace' && 
      e.key !== 'ArrowLeft' && 
      e.key !== 'ArrowRight' && 
      e.key !== 'Delete' && 
      e.key !== 'Tab' && 
      e.key !== '.' 
    ) {
      e.preventDefault();
    }
  };
  const handleSwitchCurrency = () => {
    let temp = convertCurrency;
    setConvertCurrency(convertedCurrency)
    setConvertedCurrency(temp)
    setValueRight((valueLeft * convertedCurrency.price)/ convertCurrency.price  )
  }
  const handleSearchCurrency = (e) => {
       let listCurrencyMap = currenciesSearch?.filter((item) => item.currency.toLowerCase().includes(e.target.value.toLowerCase()))
       setCurrencies(listCurrencyMap)
  }
  const iconFetch = async (iconName) => {
    await import(`../../public/images/tokens/${iconName}.svg`)
    .then(data => setCurrencies(prev=>{
      return prev.map(item=>{
        if(item.currency===iconName){
          return {
            ...item,
            img:data.default
          }        
        }
        return item
      })
      
    }))
    .catch(err => console.log(err))
  }
  
   useEffect(() => {
     if(currencies.length === numberOfCurrencies && numberOfCurrencies !== 0){
      setCurrenciesSearch(currencies)
      setConvertCurrency(currencies[0])
      setConvertedCurrency(currencies[1])
     }
   }, [currencies, numberOfCurrencies])

   const notify = () => {
    toast.success("successful transaction")
   }
   console.log("currency : ", currencies)
  return (
    <>
      <div className="container-fancy-form">
        <div className="form-container">
          <div className="text-change-currency">From {convertCurrency?.currency} To {convertedCurrency?.currency}</div>
          <div className="text-change-currency-detail">
          Convert from {convertCurrency?.currency} to {convertedCurrency?.currency}
          </div>
          <div className="change-currency-box">
            <div className="currency-to-convert-input currency-box ">
             <input
                type="tel"
                value={valueLeft}
                onChange={handleChangeCurrencyLeft}
                onKeyDown={handleKeyDown}
                placeholder="0"
                inputMode="decimal"
              />
              <div className="currency-choose"  onClick={handleShowModal}>
                <div className="currency-icon">
                <img src= { `${process.env.REACT_APP_URL}${convertCurrency?.img}`} alt="" style={{marginRight : "5px"}}/>
                </div>
                <div className="currency-name">
                  {convertCurrency?.currency}
                </div>
                <i class="fa-solid fa-angle-down"></i>
              </div>
            </div>
            <div className="switch-change-box" onClick={handleSwitchCurrency}>
            <div
              className="switch-change"
            ></div>
            </div>
            <div className="currency-converted currency-box">
              <input
                type="tel"
                value={valueRight}
                onChange={handleChangeCurrencyRight}
                onKeyDown={handleKeyDown}
                placeholder="0"
                inputMode="decimal"
              />
              <div className="currency-choose" inputMode="currency" onClick={handleShowConvered} >
                <div className="currency-icon">
                <img src= {`${process.env.REACT_APP_URL}${convertedCurrency?.img}`} alt="" style={{marginRight : "5px"}}/>
                </div>
                <div className="currency-name">
                  {convertedCurrency?.currency}
                </div>
                <i class="fa-solid fa-angle-down"></i>
              </div>
            </div>
          </div>
          <button className="btn-transaction" onClick={notify}>Trade now</button>
          <div className="convert-ratio">
            1 {convertCurrency?.currency} = {convertCurrency?.price/ convertedCurrency?.price} {convertedCurrency?.currency} Updated: {convertCurrency?.date}
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleCloseModal} backdrop="static" className="h-75">
          <Form >
            <Modal.Header closeButton >
              <Modal.Title style={{fontWeight: "600"}}>Choose currency</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div className= "input-search-box">
                  <i class="fa-solid fa-magnifying-glass"></i> 
                  <input placeholder="Choose currency"  onChange={(e) => handleSearchCurrency(e)}/>
               </div>
              
               <div className="list-currency">
                  {currencies?.length > 0 && currencies.map((item, index) => {
                    
                    return (
                      <div className="item-currency" key={index} onClick={() => handleChooseCurrency(item)}>
                      <img src= {`${process.env.REACT_APP_URL}${item.img}`} alt=""/>
                      <div className="name-currency-modal">{item.currency}</div>
                   </div>
                    )
                  })}
               </div>
            </Modal.Body>
          </Form>
        </Modal>
        <Modal show={showConverted} onHide={handleCloseConvered} backdrop="static" className="h-75">
          <Form >
            <Modal.Header closeButton>
              <Modal.Title style={{fontWeight: "600"}}>Choose currency</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form.Group className= "input-search-box">
                  <i class="fa-solid fa-magnifying-glass"></i> 
                  <input placeholder="Choose currency" onChange={(e) => handleSearchCurrency(e)}/>
               </Form.Group>
               <Form.Group>
               <div className="list-currency">
                  {currencies?.length > 0 && currencies.map((item, index) => {
                    return (
                      <div className="item-currency" key={index} onClick={() => handleChooseCurrencyConverted(item)}>
                      <img src= {`${process.env.REACT_APP_URL}${item.img}`} alt=""/>
                      <div className="name-currency-modal">{item.currency}</div>
                   </div>
                    )
                  })}
               </div>
               </Form.Group>
            </Modal.Body>
          </Form>
        </Modal>
        <ToastContainer />
    </>
  );
}
