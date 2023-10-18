function handleDatabaseError(error) {
    console.error('Erro ao buscar registros:', error);
}

function redirecionar(id) {
    window.location.href = `../home/home.html?id=${id}`;
}
