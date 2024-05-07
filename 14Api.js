const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const cron = require("cron").CronJob

var key = "YM74oy2a7cEG71AJxbhBWg2K6iKKOf42WkwkUL92CUKNoTbc2yzlZZxIzHD0qMAW"
Moralis.start({
    apiKey: key,
});

const myJob = new cron(" * * * * * * ", async () => {
    console.log("fdsghfghdsf===========");
    runApp();

});
myJob.start()

const runApp = async () => {
    try {
        const response = await Moralis.EvmApi.transaction.getTransactionVerbose({
            "chain": "0x1",
            "transactionHash": "0xaaedd2069fca7d06e4204a28a691c7d6c6826bbd38973f53c389caeb614f853f"
        });

        const fromAddress = (response.raw.from_address);
        const toAddress = (response.raw.to_address);
        // const logAddress = response.raw.logs[i].decoded_event.params[0].value;
        console.log("fromAddress=====>>>", fromAddress)
        console.log("toAddress=====>>>", toAddress)

        for (let index of response.raw.logs) {
            console.log('all log address------------------',index);
            if ( fromAddress != index.address && toAddress != index.address) {
                console.log("validated addrress ----------->", index.address);
            }

        }

    } catch (e) {
        console.error(e);
    }
}




