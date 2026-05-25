// Exemplo de Script para validação de formulário customizado
function validarFormularioLeads(email, telefone) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validação de Email (Exceção customizada via código)
    if (!regexEmail.test(email)) {
        return { status: "erro", mensagem: "Formato de e-mail inválido." };
    }

    // Validação de Telefone (Simples lógica adicional)
    if (telefone.length < 10) {
        return { status: "erro", mensagem: "Telefone incompleto." };
    }

    return { status: "sucesso", mensagem: "Dados validados com sucesso!" };
}
