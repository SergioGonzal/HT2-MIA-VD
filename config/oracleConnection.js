var oracledb = require('oracledb');

credenciales = {
    user : "sg",
    password : "201503798",
    connectString : "34.122.187.192/ORCL18"
}

try {
    oracledb.initOracleClient({libDir: '/opt/oracle/instantclient_21_1'});
} catch (err) {
    console.error('No se puede conectar al cliente!');
}

async function Open(query, binds, autoCommit) {
    let connection = await oracledb.getConnection(credenciales);
    let result = await connection.execute(query, binds, { autoCommit });
    connection.release();
    return result;
}

exports.Open = Open;