// Store already processed containers to avoid duplication
const processedContainers = new Set();

// Function to process the stock_scrollcontainer
function processStockContainer() {
  // Select all links (a) with relevant product data
  const productLinks = document.querySelectorAll('a[href*="/produkt/"]');

  for (const link of productLinks) {
    // Avoid re-processing the same container
    if (processedContainers.has(link)) {
      continue; // Skip if the container has already been processed
    }

    // Select stock_scrollcontainer and price container for each product link
    const stockContainer = link.querySelector("#stock_scrollcontainer");
    const priceContainer = link.querySelector(
      ".css-k008qs.e12xogow0 p.css-a2frwy"
    );
    const infoContainer = link.querySelector(".css-2114pf.e12xogow0"); // The parent container for the new element

    if (stockContainer) {
      console.log("Found #stock_scrollcontainer inside a product link");

      let boozePercent = 0; // in percent
      let boozeAmount = 0; // in ml
      let price = 0; // Price in currency
      let alcoholPerKrona = 0; // Alcohol per krona (ml of ethanol per kr)

      // Extract the price if the priceContainer exists
      if (priceContainer) {
        const priceText = priceContainer.textContent.trim();

        // Handle time-like price format (e.g., 16:40* => 16.67)
        let priceValue = priceText.replace(/[^\d:.,-]/g, "").replace(",", "."); // Remove unwanted chars except valid ones

        // Special handling for time format (e.g., "16:40*" should be converted to 16.67)
        const timeMatch = priceValue.match(/^(\d{1,2}):(\d{2})\*/);
        if (timeMatch) {
          // Convert time like "16:40" to 16.67 (hours + minutes/60)
          const hours = Number.parseInt(timeMatch[1], 10);
          const minutes = Number.parseInt(timeMatch[2], 10);
          priceValue = (hours + minutes / 60).toFixed(2); // Convert to a float (e.g., 16.67)
        }

        // Convert the cleaned-up price string to a float and assign it to the `price` variable
        price = Number.parseFloat(priceValue);

        if (!Number.isNaN(price)) {
          console.log("Price found:", price);
        } else {
          console.log("Failed to extract price from:", priceText);
        }
      } else {
        console.log("Price container not found for this item.");
      }

      // Process the content inside #stock_scrollcontainer
      for (const child of stockContainer.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const text = child.textContent.trim();

          // Extract amount and percent using regular expressions
          const amountMatch = text.match(/(\d{1,3}(?:[ ,]?\d{3})*)\s?ml/);
          const percentMatch = text.match(/(\d+(?:[.,]?\d+)?)\s?%/);

          if (amountMatch) {
            boozeAmount = Number.parseInt(amountMatch[1].replace(/\s/g, "")); // Remove spaces and parse
          }
          if (percentMatch) {
            boozePercent = Number.parseFloat(percentMatch[1]); // Parse the percentage
          }
        }
      }

      // Log the extracted values
      if (boozeAmount > 0 && boozePercent > 0 && !Number.isNaN(price)) {
        console.log(
          `Booze amount: ${boozeAmount}ml, Booze percent: ${boozePercent}%, Price: ${price}`
        );

        // Calculate alcohol per krona: (boozeAmount * boozePercent / 100) / price
        alcoholPerKrona = (boozeAmount * (boozePercent / 100)) / price;

        // Log the calculated values
        console.log(
          `Alcohol per krona: ${alcoholPerKrona.toFixed(2)} ml of ethanol per kr`
        );

        // Create a new element to display the alcohol per krona value
        const costElement = document.createElement("p");
        costElement.classList.add("css-cost-per-unit");
        costElement.textContent = `EPK: ${alcoholPerKrona.toFixed(2)}ml ethanol per kr`;

        // Add the new element inside the infoContainer
        infoContainer.appendChild(costElement);
      }

      // Mark this container as processed to avoid duplication
      processedContainers.add(link);
    }
  }
}

// Observe DOM changes to handle dynamic loading
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      // Call processStockContainer when the DOM changes
      processStockContainer();
    }
  }
});

// Start observing the body for changes
observer.observe(document.body, {
  childList: true, // Listen for added/removed child nodes
  subtree: true, // Listen to changes in all descendants
});

// Initial call to processStockContainer in case the element is already present
processStockContainer();
