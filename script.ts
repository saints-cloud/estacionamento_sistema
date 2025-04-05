interface Veiculo {
  nome: string;
  modelo: string;
  placa: string;
  entrada: Date;
  saida: Date | null;
}

(function () {
  // Função utilitária para selecionar qualquer elemento
  const $ = (query: string): HTMLElement | null =>
    document.querySelector(query);

  function patio() {
    // Lê os veículos do localStorage
    function ler(): Veiculo[] {
      return JSON.parse(localStorage.getItem("patio") || "[]") as Veiculo[];
    }

    // Salva o array de veículos no localStorage
    function salvar(veiculos: Veiculo[]): void {
      localStorage.setItem("patio", JSON.stringify(veiculos));
    }

    // Adiciona um novo veículo e re-renderiza a tabela
    function adicionar(veiculo: Veiculo): void {
      const veiculos = ler();
      veiculos.push(veiculo);
      salvar(veiculos);
      render();
    }

    // Remove o veículo com a placa informada e re-renderiza a tabela
    function remover(placa: string): void {
      const veiculos = ler().filter((veiculo) => veiculo.placa !== placa);
      salvar(veiculos);
      render();
    }

    // Renderiza a tabela de veículos no <tbody id="patio">
    function render(): void {
      const tbody = $("#patio");
      if (!tbody) return;
      tbody.innerHTML = ""; // Limpa o conteúdo anterior
      const veiculos = ler();
      veiculos.forEach((veiculo) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${veiculo.nome}</td>
          <td>${veiculo.modelo}</td>
          <td>${veiculo.placa}</td>
          <td>${new Date(veiculo.entrada).toLocaleString()}</td>
          <td><button class="delete" data-placa="${veiculo.placa}">X</button></td>
        `;
        tbody.appendChild(row);
      });
    }

    return { ler, adicionar, remover, salvar, render };
  }

  // Instancia o módulo de estacionamento
  const estacionamento = patio();

  // Aguarda o carregamento completo do DOM
  document.addEventListener("DOMContentLoaded", () => {
    // Renderiza os veículos ao carregar a página
    estacionamento.render();

    // Evento para cadastrar um veículo
    const btnCadastrar = $("#cadastrar");
    if (btnCadastrar) {
      btnCadastrar.addEventListener("click", () => {
        const inputNome = document.querySelector("#nome") as HTMLInputElement;
        const inputModelo = document.querySelector("#modelo") as HTMLInputElement;
        const inputPlaca = document.querySelector("#placa") as HTMLInputElement;

        const nome = inputNome?.value;
        const modelo = inputModelo?.value;
        const placa = inputPlaca?.value;

        if (!nome || !modelo || !placa) {
          alert("Os campos nome, placa e modelo são obrigatórios!");
          return;
        }

        estacionamento.adicionar({
          nome,
          modelo,
          placa,
          entrada: new Date(),
          saida: null,
        });
      });
    }

    // Utiliza event delegation para capturar cliques nos botões de remoção
    const tbody = $("#patio");
    if (tbody) {
      tbody.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("delete")) {
          const placa = target.dataset.placa;
          if (placa) {
            estacionamento.remover(placa);
          }
        }
      });
    }
  });
})();
