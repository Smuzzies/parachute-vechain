// Function to connect to VeChain wallet
async function connectVeChainWallet() {
  try {
      // Check if VeChainThor Wallet extension is installed
      if (window.connex && window.connex.thor) {
          const wallet = window.connex.thor.wallet;
          // Connect to wallet
          await wallet.connect();
          if (wallet.getAccounts().length > 0) {
              const walletAddress = wallet.getAccounts()[0];
              console.log(`Connected wallet address: ${walletAddress}`);
              // You can perform further actions with the connected wallet here
          } else {
              console.error("No accounts found in the wallet.");
          }
      } else {
          // If VeChainThor Wallet extension is not found, try Sync2 desktop/mobile wallet
          const connex = await connectToSync2();
          if (connex) {
              console.log("Connected to Sync2 wallet");
              // You can perform further actions with the connected wallet here
          } else {
              console.error("No compatible wallet extension found.");
          }
      }
  } catch (error) {
      console.error("Error connecting to wallet:", error);
  }
}

// Function to connect to Sync2 wallet
async function connectToSync2() {
  try {
      const response = await fetch('/connect-sync2'); // Route to your Node.js endpoint
      if (response.ok) {
          const connexInstance = await response.json();
          return connexInstance;
      } else {
          throw new Error(`Failed to connect to Sync2 wallet: ${response.statusText}`);
      }
  } catch (error) {
      throw new Error(`Error connecting to Sync2 wallet: ${error.message}`);
  }
}

function previewImage(input) {
  const imagePreview = document.getElementById('imagePreview');
  const mintButton = document.getElementById('mintButton');
  const imageThumbnailContainer = document.getElementById('imageThumbnailContainer');

  const file = input.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
          imagePreview.src = e.target.result;
          imageThumbnailContainer.style.display = 'block'; // Show image thumbnail container
          mintButton.disabled = false; // Enable mint button
      };
      reader.readAsDataURL(file);
  } else {
      imagePreview.src = '';
      imageThumbnailContainer.style.display = 'none'; // Hide image thumbnail container
      mintButton.disabled = true; // Disable mint button
  }
}

// Add an event listener to check if all required fields are filled for enabling the mint button
const ownerAddressInput = document.getElementById('ownerAddress');
const recipientAddressesInput = document.getElementById('recipientAddresses');
const mintButton = document.getElementById('mintButton');

[ownerAddressInput, recipientAddressesInput].forEach((input) => {
  input.addEventListener('input', function () {
      const isOwnerAddressFilled = ownerAddressInput.value.trim() !== '';
      const isRecipientAddressesFilled = recipientAddressesInput.value.trim() !== '';
      mintButton.disabled = !isOwnerAddressFilled || !isRecipientAddressesFilled;
  });
});
