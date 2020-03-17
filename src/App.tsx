import React from 'react';
import logo from './logo.svg';
import './App.css';
const crypto = require('crypto');
const utf8 = require('utf8')

function App() {

  React.useEffect(() => {
    // getAccount()
  })
  const [myAccount, setAccount] = React.useState(undefined);
  // const { depositAddresses } = myAccount!; // BTC , ETH

  const url = 'https://api.testwyre.com';
  const endpoint = "/v2/account"
  const secret = 'SK-QUQFEYN7-GPDCNVDX-E9RJNAPB-A3PZDR9N'; //this is my api secret key at testwyre.com

  const timestamp = Date.now();
  //You should include a GET parameter named timestamp which is the current time in millisecond epoch format. We use this timestamp to help protect against replay attacks.
  const x_api_key = "AK-LFB7E96M-7P4ATP8Y-GHN3NZA9-2ZF4EDEP";
  let request_url = url + endpoint;
  if (!request_url.indexOf("?")) {
    request_url += `&timestamp=${timestamp}`;
  } else {
    request_url += `?timestamp=${timestamp}`;
  }

  let body = '';
  let bodyJson = body !== '' ? JSON.stringify(body) : ''
  const headers = {
    "Content-Type": "application/json",
    "X-Api-Key": x_api_key,
    "X-Api-Signature": calc_auth_sig_hash(utf8.encode(request_url + bodyJson))
  }


  /** 
  CALCULATING THE REQUEST SIGNATURE
  Calculating the X-Api-Signature field is a two step process:
  --- Concatenate the request URL with the body of the HTTP request (encoded using UTF8) into a string. Use an empty string for the HTTP body in GET requests
  --- Compute the signature as a HEX encoded HMAC with SHA-256 and your API Secret Key
  Note: You must send the request body exactly as you sign it, whitespace and all. The server calculates the signature based on exactly what's in the request body. **/
  function calc_auth_sig_hash(value: any) {
    const hash = crypto.createHmac('sha256', utf8.encode(secret))
      .update(value)
      .digest('hex');
    return hash;
  }

  
  function getAccount(): Promise<any> {
    return fetch(request_url, {
      headers: headers,
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
  }

  
  function createAccount() {
    const accountCreationUrl = `https://api.testwyre.com/v3/accounts?timestamp=${timestamp}`;
     /**
    * https://docs.sendwyre.com/v3/docs/account-resource#section-fields 
    * This page has alll required fields for creating accounts for others.
    **/
    let post_data = {
      "type":"INDIVIDUAL",
      "country": "US",
      "subaccount": true,
      "profileFields":[
        {
          "fieldId": "individualLegalName",
          "value": "Johnny Quest"
        },
        {
          "fieldId": "individualEmail",
          "value": "JohnnyQuest22@yolo.com"
        },
        {
          "fieldId": "individualResidenceAddress",
          "value": {
            "street1": "1 Market St",
            "street2": "Suite 402",
            "city": "San Francisco",
            "state": "CA",
            "postalCode": "94105",
            "country": "US"
          }
        }
      ]
    }

    let headers = {
      "Content-Type": "application/json",
      'X-API-Key': x_api_key,
      'X-Api-Signature': calc_auth_sig_hash(utf8.encode(accountCreationUrl + JSON.stringify(post_data)))
    }
    fetch(accountCreationUrl, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify(post_data)
    })
    .then(response => {
      console.log(response.status)
      return response.json()})
    .then(data => console.log(data))
    .catch(error => console.log(`Error message: ${error}`))
  }

  // createAccount();

  function createTransfer(){
    // https://legacy-docs.sendwyre.com/docs/creating-a-transfer-and-getting-a-quote
    // We have other params you can pass into this object e.g callbackUrl which returns the status of the transfer.
    let transferUrl = `https://api.testwyre.com/v3/transfers?timestamp=${timestamp}`
    let transferObject = {  
      "source":"bitcoin:mzEx8yaQiRjf4vHErJWKeTucYevyF4TkWg",
      "sourceCurrency":"USD",
      "sourceAmount":"5",
      "dest":"bitcoin:mzEx8yaQiRjf4vHErJWKeTucYevyF4TkWg",
      "destCurrency":"BTC", 
      "message": "Payment for DorianNakamoto@sendwyre.com",
      "autoConfirm":true  
    }
    fetch(transferUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': x_api_key,
        'x-api-signature': calc_auth_sig_hash(utf8.encode(transferUrl + JSON.stringify(transferObject)))
      },
      method: 'POST',
      body: JSON.stringify(transferObject)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
  }

  createTransfer()
  return (
    <div className="App">
      {/* <button onClick={() => generateToken()}>Generate token</button> */}
      {/* {!token ? '': token} */}
      {/* <button onClick={get_API_KEY} disabled={token ? false : true}>Get API key</button> */}
      {/* {apiKeyResponse ? JSON.stringify(apiKeyResponse!): undefined} */}
    </div>
  );
}

export default App;
