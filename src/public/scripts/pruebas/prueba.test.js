const { connect, close, getUserByUsername } = require('./purebaIntegracion');

beforeAll(async () => {
    await connect();
});

afterAll(async () => {
    await close();
});

test('Obtener un usuario', async () => {
    const userId = "seogonzalez"
    const user = await getUserByUsername(userId);

    expect(user).toEqual({ 
    "apellido": "González Rojas",
    "contrasenia": "1234",
    "datos_adicionales": "",
    "email": "sergioagrvi@gmail.com",
    "img": "1716389693391-1711147417044.jpg",
    "nombre": "Sergio",
    "telefono": "654587900",
    "username": "seogonzalez"});
});