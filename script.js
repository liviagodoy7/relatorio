function gerar(pdf = false, print = false) {
 
    document.getElementById('doc-cliente').textContent = 
        document.getElementById('cliente').value || "Não informado";
    
    const dataInput = document.getElementById('data').value;
    document.getElementById('doc-data').textContent = 
        dataInput ? new Date(dataInput).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');
    
  
    const today = new Date();
    document.getElementById('current-date').textContent = 
        today.toLocaleDateString('pt-BR');
    
    
    const itensContainer = document.getElementById('doc-itens');
    itensContainer.innerHTML = '';
    
    const rows = document.querySelectorAll('.item-row');
    let total = 0;
    
    rows.forEach((row, index) => {
        const desc = row.querySelector('.item-desc').value || `Item ${index + 1}`;
        const qtd = parseFloat(row.querySelector('.item-qtd').value) || 0;
        const valor = parseFloat(row.querySelector('.item-valor').value) || 0;
        const itemTotal = qtd * valor;
        
        total += itemTotal;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${desc}</td>
            <td>${qtd}</td>
            <td>R$ ${valor.toFixed(2).replace('.', ',')}</td>
            <td>R$ ${itemTotal.toFixed(2).replace('.', ',')}</td>
        `;
        itensContainer.appendChild(tr);
    });
    
   
    document.getElementById('doc-total').textContent = 
        `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    document.getElementById('doc-observacoes').textContent = 
        document.getElementById('observacoes').value || "Nenhuma observação informada.";
    
  
    document.getElementById('doc-solicitante').textContent = 
        document.getElementById('solicitante').value || "Não informado";
    document.getElementById('doc-aprovador').textContent = 
        document.getElementById('aprovador').value || "Não informado";
    
    
    const relatorio = document.getElementById('relatorio');
    relatorio.style.display = 'block';
    
    relatorio.scrollIntoView({ behavior: 'smooth' });
   
    const opt = {
        margin: 10,
        filename: 'Documento_Slaves.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            hotfixes: ["px_scaling"] 
        }
    };
    
    
    if (pdf) {
        
        const element = relatorio.cloneNode(true);
        element.style.display = 'block';
        document.body.appendChild(element);
        
        html2pdf().set(opt).from(element).save().then(() => {
            
            document.body.removeChild(element);
        });
    } else if (print) {
       
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body * {
                    visibility: hidden;
                }
                #relatorio, #relatorio * {
                    visibility: visible;
                }
                #relatorio {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    margin: 0;
                    padding: 20px;
                }
                .buttons, .input-section {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        window.print();
        
        
        setTimeout(() => {
            document.head.removeChild(style);
        }, 1000);
    }
}

function adicionarItem() {
    const container = document.getElementById('itens-container');
    const newRow = document.createElement('div');
    newRow.className = 'item-row';
    newRow.innerHTML = `
        <input type="text" placeholder="Descrição" class="item-desc">
        <input type="number" placeholder="Qtd" class="item-qtd" min="1">
        <input type="number" placeholder="Valor Unit." class="item-valor" step="0.01" min="0">
        <button class="btn-remove" onclick="removerItem(this)">×</button>
    `;
    container.appendChild(newRow);
}

function removerItem(button) {
    const row = button.closest('.item-row');
    if (row) {
        row.remove();
    }
}