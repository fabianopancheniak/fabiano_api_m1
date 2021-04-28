const env = process.env.NODE_ENV || 'dev';

const config = () => {
    switch (env) {
        case 'dev' :
            return {
                dbString : 'mongodb+srv://fabiano:1705@cluster0.tb917.mongodb.net/m1_db?retryWrites=true&w=majority',
                jwtPass : 'starwarsémelhorquestartrek',
                jwtExpires : '1d'
            }
        case 'hml' :
            return {
                dbString : 'mongodb+srv://fabiano:1705@cluster0.tb917.mongodb.net/m1_db?retryWrites=true&w=majority',
                jwtPass : 'starwarsémelhorquestartrek',
                jwtExpires : '1d'
            }
        case 'prod' :
            return {
                dbString : 'mongodb+srv://fabiano:1705@cluster0.tb917.mongodb.net/m1_db?retryWrites=true&w=majority',
                jwtPass : 'starwarsémelhorquestartrek',
                jwtExpires : '1d'
            }
    }
};

console.log(`Iniciando a API em ambiente ${env.toUpperCase()}`);

module.exports = config();