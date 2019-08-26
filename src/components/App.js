import React, { Component } from 'react';

class App extends Component {
  state = {
    amount: "", // amount value from the form
    amountConverted: false, // is the amount after conversion to words format?
    amountInWordsIteger: "", // final words value of integer amount (amount before point)
    amountInWordsAfterPoint: "" // final words value of amount after point
  }

  // empty arrays for word names of hundreds, dozens and unities (these names are downloaded from another file)
  hundreds = [];
  dozens = [];
  unities = [];

  // arrays with suffix variants
  billionSuffixes = ["miliard", "miliardy", "miliardów"];
  millionSuffixes = ["milion", "miliony", "milionów"];
  thousandSuffixes = ["tysiąc", "tysiące", "tysięcy"];
  zlSuffixes = ["złoty", "złote", "złotych"];
  grSuffixes = ["grosz", "grosze", "groszy"];

  // method, which changes the state with data from the form and resets result of the conversion (because after changing data, App shouldn't show the result)
  handleChangeAmount = (e) => {
    this.setState({
      amount: e.target.value,
      amountConverted: false,
      amountInWordsIteger: "",
      amountInWordsAfterPoint: ""
    });
  }

  // method, which calls the conversion method, after submitting the form with amount value
  handleConvertAmount = (e) => {
    e.preventDefault();
    this.setAmountInWords();
  }

  // main method, which converts amount from number format to words format - it also calls other methods
  setAmountInWords = () => {
    let amount = this.state.amount;

    // division the amount into three-digit numbers (billions, millions, thousands and the rest)
    const billions = this.getAmountPart(amount, 1000000000);
    amount %= 1000000000;

    const millions = this.getAmountPart(amount, 1000000);
    amount %= 1000000;

    const thousands = this.getAmountPart(amount, 1000);
    amount %= 1000;

    const integerAmount = Math.floor(amount);
    const afterPoint = Math.round((amount - integerAmount) * 100);


    // amount conversion from the number format to words format
    let amountInWordsIteger = "";
    let amountInWordsAfterPoint = "";

    if (this.state.amount < 1) {
      amountInWordsIteger = "zero ";
    } else {
      amountInWordsIteger += this.getPartAmountInWords(billions, this.billionSuffixes);
      amountInWordsIteger += this.getPartAmountInWords(millions, this.millionSuffixes);
      amountInWordsIteger += this.getPartAmountInWords(thousands, this.thousandSuffixes);
      amountInWordsIteger += this.getPartAmountInWords(integerAmount, "");
    }
    amountInWordsIteger += this.setSuffix(this.zlSuffixes, Math.floor(this.state.amount));

    if (afterPoint > 0) {
      amountInWordsAfterPoint = ` i ${this.getPartAmountInWords(afterPoint, "")}`;
      amountInWordsAfterPoint += this.setSuffix(this.grSuffixes, afterPoint);
    }

    this.setState({
      amountConverted: true,
      amountInWordsIteger,
      amountInWordsAfterPoint
    });
  }

  // method, which returns three-digit number from longer number (ex. numbers of billions, millions etc.)
  getAmountPart = (amount, converter) => {
    let amountPart = 0;

    if (amount >= converter) {
      amountPart = Math.floor(amount / converter);
    }

    return amountPart;
  }

  // method, which returns amount in words for a three-digit number
  getPartAmountInWords = (amountNumber, suffixArray) => {
    let partAmountInWords = "";

    if (amountNumber > 0) {
      let hundreds = 0;
      let dozens = 0;
      let unities = 0;

      hundreds = Math.floor(amountNumber / 100);
      if ((amountNumber % 100) >= 20) {
        dozens = Math.floor((amountNumber % 100) / 10);
        unities = (amountNumber % 100) % 10;
      } else {
        unities = amountNumber % 100;
      }

      partAmountInWords += this.findAmountWord(this.hundreds, hundreds);
      partAmountInWords += this.findAmountWord(this.dozens, dozens);
      partAmountInWords += this.findAmountWord(this.unities, unities);

      if (suffixArray !== "") {
        if (amountNumber === 1) {
          partAmountInWords = this.setSuffix(suffixArray, amountNumber) + " ";
        } else {
          partAmountInWords += this.setSuffix(suffixArray, amountNumber) + " ";
        }
      }
    }

    return partAmountInWords;
  }

  // method, which returns amount in word for a single number of hundreds, dozens or unities in the three-digit number
  findAmountWord = (wordsArray, amountNumber) => {
    let amountWord = "";
    if (amountNumber > 0) {
      wordsArray.forEach(item => {
        if (parseInt(item.amountInNumber) === amountNumber) {
          amountWord = item.amountInWords + " ";
        }
      });
    }
    return amountWord;
  }

  // method, which returns suffix of the number in correct variant
  setSuffix = (suffixArray, amountNumber) => {
    if (amountNumber === 1) {
      return suffixArray[0];
    } else if (((amountNumber % 100) < 10) || ((amountNumber % 100) > 20)) {
      if ((amountNumber % 10 === 2) || (amountNumber % 10 === 3) || (amountNumber % 10 === 4)) {
        return suffixArray[1];
      } else {
        return suffixArray[2];
      }
    } else {
      return suffixArray[2];
    }
  }

  // method, which is called after click the "Copy" button - it copies the amount in words to clipboard
  handleCopyClick = () => {
    const copyText = document.querySelector("p.result");

    const textArea = document.createElement("textarea");
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);

    textArea.select();
    textArea.setSelectionRange(0, 99999);
    document.execCommand("copy");

    textArea.remove();
  }

  // method, which gets amount names from another file and saves it in arrays, located in this component
  fetchAmountPartWords = () => {
    fetch('data/amountPartWords.json')
      .then(response => response.json())
      .then(data => {
        this.hundreds = data.hundreds;
        this.dozens = data.dozens;
        this.unities = data.unities;
      });
  }

  // method, which is called after first rendering the component - it calls fetch method, which gets amount names from another file
  componentDidMount() {
    this.fetchAmountPartWords();
  }

  // rendering the component with two parts - form to enter the amount and the program result
  render() {
    return (
      <>
        <form onSubmit={this.handleConvertAmount}>
          <span>Wprowadź kwotę:</span>
          <input
            type="number"
            min="0"
            max="999999999999.99"
            step="0.01"
            value={this.state.amount}
            onChange={this.handleChangeAmount}
          />
          <button><i className="fas fa-sync-alt"></i> Konwertuj</button>
        </form>
        {this.state.amountConverted ? (
          <div className="result">
            <h2>Kwota słownie:</h2>
            <p className="result">{this.state.amountInWordsIteger}{this.state.amountInWordsAfterPoint}</p>
            <button onClick={this.handleCopyClick}><i className="fas fa-copy"></i> Kopiuj</button>
          </div>
        ) : null}
      </>
    );
  }
}

export default App;