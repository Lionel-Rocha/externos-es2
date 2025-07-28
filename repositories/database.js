const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config(); // Carrega variáveis do .env

// Função para conectar ao banco
function connectDb() {
    const pool = new Pool({
        connectionString: process.env.DBCOMPLETE,
        ssl: {
            rejectUnauthorized: false
        }
    });
    return pool;
}

// Apaga todos os dados da tabela "cobrancas"
async function restoresDatabase() {
    const pool = connectDb();
    try {
        await pool.query("DELETE FROM cobrancas;");
        console.log("Tabela 'cobrancas' restaurada com sucesso.");
    } catch (error) {
        console.error("Erro ao restaurar banco:", error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Pega todas as cobranças de um usuário
async function buscarCobrancasPorUsuario(userId) {
    const pool = connectDb();
    try {
        const res = await pool.query(
            `SELECT * FROM cobrancas WHERE user_id = $1 ORDER BY date DESC`,
            [userId]
        );
        return res.rows;
    } finally {
        await pool.end();
    }
}

// Salva nova cobrança (bill)
async function salvarCobranca({ ciclista, orderid, value, status = 'PENDING' }) {
    const pool = connectDb();
    let date = new Date().toISOString().replace(',', '')
    try {
        const res = await pool.query(
            `INSERT INTO cobrancas (ciclista, orderid, amount, status, createdate)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [ciclista, orderid, value, status, date]
        );
        return (res.rows[0]);
    } finally {
        await pool.end();
    }
}

// Retorna uma cobrança específica por ID
async function buscarCobrancaPorId(id) {
    const pool = connectDb();
    try {
        const res = await pool.query(
            `SELECT * FROM cobrancas WHERE orderid = $1`,
            [id]
        );
        return res.rows[0] || null;
    } finally {
        await pool.end();
    }
}

// Retorna as cobranças pendentes de um usuário
async function buscarCobrancasPendentes() {
    const pool = connectDb();
    try {
        const res = await pool.query(
            `SELECT * FROM cobrancas WHERE status = 'PENDING' ORDER BY createdate DESC`,
        );
        return res.rows;
    } finally {
        await pool.end();
    }
}

// Retorna a última cobrança pendente de um usuário
async function buscarUltimaCobrancaPendente(ciclista) {
    const pool = connectDb();
    try {
        const res = await pool.query(
            `SELECT * FROM cobrancas
             WHERE ciclista = $1 AND status = 'PENDING'
             ORDER BY createdate DESC LIMIT 1`,
            [ciclista]
        );
        return res.rows[0] || null;
    } finally {
        await pool.end();
    }
}

// Retorna dados do cartão de crédito do ciclista
async function buscarCartaoPorCiclista(ciclista) {
    const pool = connectDb();
    try {
        const res = await pool.query(
            `SELECT id AS ciclista,
                    numero_cartao AS numero,
                    nome_no_cartao AS nome_no_cartao,
                    validade,
                    codigo_seguranca AS codigo_seguranca
             FROM ciclistas
             WHERE id = $1`,
            [ciclista]
        );
        return res.rows[0] || null;
    } finally {
        await pool.end();
    }
}

async function updateCobrancaStatus(billId){
    const pool = connectDb();
    try {
        await pool.query(
            `UPDATE cobrancas SET status = 'COMPLETED' WHERE orderid = $1`,
            [billId]
        );
    } catch (error) {
        console.error("Erro ao atualizar status da cobrança:", error);
        throw error;
    } finally {
        await pool.end();
    }
}

module.exports = {
    restoresDatabase,
    buscarCobrancasPorUsuario,
    salvarCobranca,
    buscarCobrancaPorId,
    buscarCobrancasPendentes,
    buscarUltimaCobrancaPendente,
    buscarCartaoPorCiclista,
    updateCobrancaStatus
};
