-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 01-Dez-2023 às 14:33
-- Versão do servidor: 10.4.22-MariaDB
-- versão do PHP: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `teste`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_calendario`
--

CREATE TABLE `tb_calendario` (
  `id_calendario` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `backgroundColor` varchar(120) NOT NULL,
  `id_usuario_FK` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_diario`
--

CREATE TABLE `tb_diario` (
  `id_diario` int(11) NOT NULL,
  `id_calendario_FK` int(11) NOT NULL,
  `humor` varchar(120) NOT NULL,
  `diario` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_exercicios`
--

CREATE TABLE `tb_exercicios` (
  `id_exercicios` int(11) NOT NULL,
  `id_calendario_FK` int(11) NOT NULL,
  `tempoExercicio` varchar(120) NOT NULL,
  `descricaoExercicio` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_metas`
--

CREATE TABLE `tb_metas` (
  `id_meta` int(11) NOT NULL,
  `id_usuario_FK` int(11) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `concluida` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_sono`
--

CREATE TABLE `tb_sono` (
  `id_sono` int(11) NOT NULL,
  `horaDormiu` varchar(120) NOT NULL,
  `horaAcordou` varchar(120) NOT NULL,
  `id_calendario_FK` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb_usuario`
--

CREATE TABLE `tb_usuario` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `senha` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `tb_calendario`
--
ALTER TABLE `tb_calendario`
  ADD PRIMARY KEY (`id_calendario`),
  ADD KEY `id_usuario` (`id_usuario_FK`);

--
-- Índices para tabela `tb_diario`
--
ALTER TABLE `tb_diario`
  ADD PRIMARY KEY (`id_diario`),
  ADD KEY `id_calendario` (`id_calendario_FK`);

--
-- Índices para tabela `tb_exercicios`
--
ALTER TABLE `tb_exercicios`
  ADD PRIMARY KEY (`id_exercicios`),
  ADD KEY `id_calendario` (`id_calendario_FK`);

--
-- Índices para tabela `tb_metas`
--
ALTER TABLE `tb_metas`
  ADD PRIMARY KEY (`id_meta`),
  ADD KEY `id_usuario_FK` (`id_usuario_FK`);

--
-- Índices para tabela `tb_sono`
--
ALTER TABLE `tb_sono`
  ADD PRIMARY KEY (`id_sono`),
  ADD KEY `id_calendario` (`id_calendario_FK`);

--
-- Índices para tabela `tb_usuario`
--
ALTER TABLE `tb_usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `tb_calendario`
--
ALTER TABLE `tb_calendario`
  MODIFY `id_calendario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=574;

--
-- AUTO_INCREMENT de tabela `tb_diario`
--
ALTER TABLE `tb_diario`
  MODIFY `id_diario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=401;

--
-- AUTO_INCREMENT de tabela `tb_exercicios`
--
ALTER TABLE `tb_exercicios`
  MODIFY `id_exercicios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT de tabela `tb_metas`
--
ALTER TABLE `tb_metas`
  MODIFY `id_meta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT de tabela `tb_sono`
--
ALTER TABLE `tb_sono`
  MODIFY `id_sono` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT de tabela `tb_usuario`
--
ALTER TABLE `tb_usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `tb_calendario`
--
ALTER TABLE `tb_calendario`
  ADD CONSTRAINT `tb_calendario_ibfk_1` FOREIGN KEY (`id_usuario_FK`) REFERENCES `tb_usuario` (`id_usuario`);

--
-- Limitadores para a tabela `tb_diario`
--
ALTER TABLE `tb_diario`
  ADD CONSTRAINT `tb_diario_ibfk_1` FOREIGN KEY (`id_calendario_FK`) REFERENCES `tb_calendario` (`id_calendario`);

--
-- Limitadores para a tabela `tb_exercicios`
--
ALTER TABLE `tb_exercicios`
  ADD CONSTRAINT `tb_exercicios_ibfk_1` FOREIGN KEY (`id_calendario_FK`) REFERENCES `tb_calendario` (`id_calendario`);

--
-- Limitadores para a tabela `tb_metas`
--
ALTER TABLE `tb_metas`
  ADD CONSTRAINT `id_usuario_FK` FOREIGN KEY (`id_usuario_FK`) REFERENCES `tb_usuario` (`id_usuario`);

--
-- Limitadores para a tabela `tb_sono`
--
ALTER TABLE `tb_sono`
  ADD CONSTRAINT `tb_sono_ibfk_1` FOREIGN KEY (`id_calendario_FK`) REFERENCES `tb_calendario` (`id_calendario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
