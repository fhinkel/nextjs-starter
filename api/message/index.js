module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const greetings = ["hello", "hola", "hallo", "ciao"];
    context.res.headers = {"Access-Control-Allow-Origin": '*'};
    context.res.json({
        text: greetings[Math.floor(Math.random()*greetings.length)],
    });
}