import React, { useEffect, useState } from 'react';
import axios from "axios"
import logo from './logo.svg';

interface cardProps {
  name: string,
  card_number: string,
  credit_limit: number,
  balance?: number 
}

const App: React.FC = () => {
  // ** Add card data ** //
  const [newCardDetails, setNewCardDetails] = useState<cardProps>({
    name: "",
    card_number: "",
    credit_limit: 0
  })

  const [errors, setErrors] = useState<{ [ key: string ]: boolean }>({
    name: false,
    card_number: false,
    credit_limit: false,
    error: false,
    duplicate: false
  })

  // ** Existing card data ** //
  const [storedCardData, setStoredCardData] = useState<cardProps[]>([])

  const getCardDetails = async () => {
    await axios({
      method: "get",
      url: "http://localhost:3001/v1/creditCards/getAll"
    })
    .then((value) => {
      const response = value.data;

      if(response.success === true) {
        setStoredCardData(response.data)
      }
    })
    .catch((err) => {
      console.error(err)
      alert(err)
    })
  }

  useEffect(() => {
    getCardDetails()
  }, [])

  const handleUpdateNewCardDetails = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    console.log(name)

    setNewCardDetails({
      ...newCardDetails,
      [name]: value
    })

    setErrors({
      ...errors,
      [name]: false
    })
  }

  // Check that all card details have been entered correctly
  const handleDataValidation = (): boolean => {
    let errors_object: { [ key: string ]: boolean } = {}
    let errors_count: number = 0;

    // -- Name
    if(newCardDetails.name.length < 4 || /^[a-zA-Z\s]+$/.test(newCardDetails.name) === false) {
      errors_object.name = true
      errors_count++
    }

    // -- Card number
    if(newCardDetails.card_number.length < 15 || newCardDetails.card_number.length > 19 ) {
      errors_object.card_number = true
      errors_count++
    }

    // -- Credit limit
    if(newCardDetails.credit_limit === 0 || newCardDetails.credit_limit > 10000) {
      errors_object.credit_limit = true
      errors_count++
    }

    if(errors_count > 0) {
      setErrors({
        ...errors,
        ...errors_object
      })

      return false
    } else {
      return true
    }
  }

  const handleSubmitNewCard = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if(handleDataValidation() === true) {
      await axios({
        method: "post",
        url: "http://localhost:3001/v1/creditCards/add",
        data: {
          card_number: newCardDetails.card_number,
          name: newCardDetails.name,
          credit_limit: newCardDetails.credit_limit
        }
      })
      .then( async (value) => {
        const response = value.data;

        if(response.success === true) {
          await getCardDetails();

          setNewCardDetails({
            name: "",
            card_number: "",
            credit_limit: 0
          })
        } else {
          alert(response.reason)
        }
      })
    }
  }

  return (
    <React.Fragment>
      <div className="app-outer-container">
        <div className="app-inner-container">
          <h1>Credit card system</h1>

          {/* Add credit card section (In large app, would separate into component) */}
          <div className="add-credit-card-container">
            <h2>Add a credit card</h2>

            <form>
              {/* Name of customer */}
              <label className="input-wrapper name" htmlFor="name">
                <div className="input-content">
                  <input
                    id="name"
                    className="input-text"
                    placeholder="e.g. J R Smith"
                    autoComplete="off"
                    name="name"
                    onChange={handleUpdateNewCardDetails}
                    value={newCardDetails.name}
                  />

                  <label className="input-label" htmlFor="name">Your name</label>
                </div>
              </label>

              {
                errors.name ? (
                  <p className='error-message'>Please enter the name as it appears on your card</p>
                ) : null
              }

              {/* Card number */}
              <label className="input-wrapper card_number" htmlFor="card_number">
                <div className="input-content">
                  <input
                    id="card_number"
                    className="input-text"
                    placeholder="e.g. 1234 5678 9012 3456"
                    maxLength={19}
                    autoComplete="off"
                    name="card_number"
                    onChange={handleUpdateNewCardDetails}
                    value={newCardDetails.card_number}
                  />

                  <label className="input-label" htmlFor="card_number">Card number</label>
                </div>
              </label>

              {
                errors.card_number ? (
                  <p className='error-message'>Please enter a valid credit card number</p>
                ) : null
              }

              {/* Credit limit */}
              <label className="input-wrapper limit" htmlFor="credit_limit">
                <div className="input-content">
                  <input
                    id="credit_limit"
                    className="input-text"
                    type="number"
                    step="0.01"
                    min={0}
                    max={10000}
                    placeholder="e.g. 1000"
                    autoComplete="off"
                    name="credit_limit"
                    onChange={handleUpdateNewCardDetails}
                    value={newCardDetails.credit_limit}
                  />

                  <label className="input-label" htmlFor="name">Credit limit</label>
                </div>
              </label>

              {
                errors.limit ? (
                  <p className='error-message'>Please enter a credit limit for this card above £0</p>
                ) : null
              }

              <button
                className="standard-button"
                onClick={handleSubmitNewCard}
              >Add new card</button>
            </form>
          </div>

          <br/>

          <h2>Existing credit cards</h2>

          <table className="existing-cards-table">
            <tbody>
              <tr>
                <th>Name</th>
                <th>Card number</th>
                <th>Balance</th>
                <th>Limit</th>
              </tr>
              {storedCardData.length > 0 ? (
                <React.Fragment>
                  {
                    storedCardData.map(card => (
                      <tr>
                        <td>{card.name}</td>
                        <td>{card.card_number}</td>
                        <td>£{card.balance}</td>
                        <td>£{card.credit_limit}</td>
                      </tr>
                    ))
                  }
                </React.Fragment>
              ) : (
                <tr>
                  <td colSpan={4}>Database currently empty</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </React.Fragment>
  )
}

export default App;
