import React, { useState } from 'react';

const Fomo = () => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');
  const [input5, setInput5] = useState('');
  const [input6, setInput6] = useState('');
  const [input7, setInput7] = useState('');
  const [input8, setInput8] = useState('');
  const [input9, setInput9] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Deploy the smart contract here using the input values
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Input 1:
        <input
          type="text"
          value={input1}
          onChange={(event) => setInput1(event.target.value)}
        />
      </label>
      <br />
      <label>
        Input 2:
        <input
          type="text"
          value={input2}
          onChange={(event) => setInput2(event.target.value)}
        />
      </label>
      <br />
      <label>
        Input 3:
        <input
          type="text"
          value={input3}
          onChange={(event) => setInput3(event.target.value)}
        />
      </label>
      <br />
      <label>
        Input 4:
        <input
          type="text"
          value={input4}
          onChange={(event) => setInput4(event.target.value)}
        />
      </label>
      <br />
      <label>
        Input 5:
        <input
          type="text"
          value={input5}
          onChange={(event) => setInput5(event.target.value)}
        />
      </label>
      <br />
      <label>
        Input 6:
        <input
          type="text"
          value={input6}
          onChange={(event) => setInput6(event.target.value)}
        />
      </label>
      <br />
      <label>
        Input 7:
        <input
          type="text"
          value={input7}
          onChange={(event) => setInput7(event.target.value)}
        />
      </label>
      <br />
      <label>
        Input 8:
        <input
          type="text"
          value={input8}
          onChange={(event) => setInput8(event.target.value)}
        />
      </label>
      <br />
      <label>
        Input 9:
        <input
          type="text"
          value={input9}
          onChange={(event) => setInput9(event.target.value)}
        />
      </label>
      <br />
        <button type="submit">Deploy Contract</button>
  </form>
);
};


export default Fomo;
