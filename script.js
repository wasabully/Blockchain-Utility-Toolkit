window.addEventListener('load', async function () {
	let web3;

	if (typeof window.ethereum !== 'undefined') {
		try {
			const accounts = await ethereum.request({ method: 'eth_accounts' });
			if (accounts.length > 0) {
				const account = accounts[0];
				document.getElementById(
					'walletAddress'
				).innerText = `Connected account: ${account}`;

				web3 = new Web3(window.ethereum);

				const balance = await web3.eth.getBalance(account);
				const balanceEth = web3.utils.fromWei(balance, 'ether');
				document.getElementById(
					'balanceOutput'
				).innerText = `Balance: ${balanceEth} ETH`;
			}
		} catch (error) {
			console.error('Error connecting to Metamask:', error);
		}

		document
			.getElementById('connectButton')
			.addEventListener('click', async () => {
				try {
					const accounts = await ethereum.request({
						method: 'eth_requestAccounts',
					});
					const account = accounts[0];
					document.getElementById(
						'walletAddress'
					).innerText = `Connected account: ${account}`;

					web3 = new Web3(window.ethereum);

					const balance = await web3.eth.getBalance(account);
					const balanceEth = web3.utils.fromWei(balance, 'ether');
					document.getElementById(
						'balanceOutput'
					).innerText = `Balance: ${balanceEth} ETH`;
				} catch (error) {
					console.error('Metamask request error:', error);
					if (error.code === -32002) {
						alert('under consideration.');
					} else {
						console.error(error);
					}
				}
			});

		document.getElementById('hashButton').addEventListener('click', () => {
			const inputText = document.getElementById('inputText').value;
			const hash = CryptoJS.SHA256(inputText).toString(CryptoJS.enc.Hex);
			document.getElementById('hashOutput').innerText = `SHA256 Hash: ${hash}`;
		});

		document.getElementById('encryptButton').addEventListener('click', () => {
			const inputText = document.getElementById('encryptText').value;
			const encryptionKey = document.getElementById('encryptionKey').value;
			const encryptedText = CryptoJS.AES.encrypt(
				inputText,
				encryptionKey
			).toString();
			document.getElementById(
				'encryptedOutput'
			).innerText = `Encrypted Text: ${encryptedText}`;
		});

		document.getElementById('decryptButton').addEventListener('click', () => {
			const encryptedTextElement = document.getElementById('encryptedOutput');
			const encryptedText = encryptedTextElement.innerText.includes(
				'Encrypted Text: '
			)
				? encryptedTextElement.innerText.split('Encrypted Text: ')[1].trim()
				: encryptedTextElement.innerText.trim();
			const decryptionKey = document.getElementById('decryptionKey').value;

			try {
				const bytes = CryptoJS.AES.decrypt(encryptedText, decryptionKey);
				const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

				if (decryptedText) {
					document.getElementById(
						'decryptedOutput'
					).innerText = `Decrypted Text: ${decryptedText}`;
				} else {
					throw new Error('Decryption failed');
				}
			} catch (error) {
				console.error('Decryption error:', error.message);
				document.getElementById('decryptedOutput').innerText =
					'Decryption error. check the decryption key and encrypted text..';
			}
		});

		function openAppInFrame(url) {
			const iframe = document.getElementById('appFrame');
			iframe.src = url;
		}

		const appList = [
			{
				id: 'uniswapButton',
				url: 'https://app.uniswap.org/',
				label: 'Open Uniswap',
			},
			{
				id: 'bugsButton',
				url: 'https://bugs.denet.pro/',
				label: 'Open Bugs Denet',
			},
			{
				id: 'revertButton',
				url: 'https://revert.finance/',
				label: 'Open Revert Finance',
			},
		];

		const appDock = document.getElementById('appDock');
		appList.forEach(app => {
			const button = document.createElement('button');
			button.id = app.id;
			button.textContent = app.label;
			button.addEventListener('click', () => openAppInFrame(app.url));
			appDock.appendChild(button);
		});

		document
			.getElementById('sendTransactionButton')
			.addEventListener('click', async () => {
				const recipientAddress =
					document.getElementById('recipientAddress').value;
				const amountEth = document.getElementById('amountEth').value;

				try {
					const accounts = await ethereum.request({
						method: 'eth_requestAccounts',
					});
					const account = accounts[0];

					if (!web3.utils.isAddress(recipientAddress)) {
						throw new Error('Invalid recipient address');
					}

					const amountWei = web3.utils.toWei(amountEth, 'ether');

					const txObject = {
						from: account,
						to: recipientAddress,
						value: amountWei,
					};

					const txHash = await web3.eth.sendTransaction(txObject);
					alert(`Transaction sent: ${txHash}`);
				} catch (error) {
					console.error('Transaction error:', error.message);
					alert(`Transaction error: ${error.message}`);
				}
			});
	} else {
		console.error('Metamask not detected');
	}
});
