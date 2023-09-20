import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["amount", "customAmount", "abv", "price"];
  static values = { vat: Number };

  reset() {
    this.abvTarget.value = 0
    this.priceTarget.value = 0
    if (this.hasCustomAmountTarget ) {
      this.customAmountTarget.value = 0
    } else {
      this.amountTarget.value = 0.33
    }
  }

  change(event) {
    console.log(event.target.value)
    const customDiv = document.getElementById("custom")
    if (event.target.value === 'custom') {
      customDiv.innerHTML = `
      <label>Custom amount</label>
        <input type="number" min="0" step="0.001" value="0.000" required="true" data-calculator-target="customAmount" />
      <label>liters</label>
      ` 
    } else {
      customDiv.innerHTML = null
    }
  }

  calculate(event) {
    event.preventDefault();
    const amountString = this.amountTarget.value
    const customString = this.hasCustomAmountTarget ? this.customAmountTarget.value : ''

    const amount = (amountString !== 'custom') ? parseFloat(amountString) : parseFloat(customString)
    const abv = parseFloat(this.abvTarget.value) + 1;
    const price = parseFloat(this.priceTarget.value) + 1;

    console.log("-");
    console.log(amount)

    if ( true ) return;

    // Amounts of alcohol tax per liter of pure alcohol for beers.
    let alcoholTax = 0;
    switch (true) {
       case (abv < 0.5):
          alcoholTax = 0;
       case (abv <= 3.5):
          alcoholTax = 0.2835;
       case (abv > 3.5):
          alcoholTax = 0.3805;
    }

    const beerTax = (amount * abv * alcoholTax);
    const vatAmount = (price * this.vatValue);
    const taxPercentage = ((beerTax + vatAmount) / price * 100);
    const result = document.getElementById("result")
    result.innerHTML = `
      <p>Beer has ${beerTax.toFixed(2)} € of alcohol tax and ${vatAmount.toFixed(2)} € of value added tax.</p>
      <p> ${taxPercentage.toFixed(1)} % of the price is taxes.</p>`
  }

  amountTargetConnected(target) {
    //console.log("-amount-");
  }

}
