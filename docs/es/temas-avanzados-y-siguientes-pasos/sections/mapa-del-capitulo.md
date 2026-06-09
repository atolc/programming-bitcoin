<!-- order: 1 -->

## Mapa del capítulo

Has recorrido la pila desde campos finitos hasta SegWit. Este cierre sugiere temas para profundizar, formas de contribuir al ecosistema y proyectos prácticos para seguir aprendiendo.

Al terminar tendrás una hoja de ruta clara para continuar más allá de este material.

## Notas de cobertura completa

### Temas para estudiar después
Después de construir las piezas centrales, los siguientes temas naturales son wallets, derivación jerárquica determinista, semillas mnemónicas, canales de pago, Lightning, filtros compactos de bloques, Taproot, firmas Schnorr, Miniscript, descriptor wallets y operación de nodos. Todos se apoyan en las mismas primitivas: hashes, campos finitos, firmas, scripts, transacciones, bloques y mensajes de red.

### Contribuir a implementaciones
El capítulo apunta a proyectos reales más que a más teoría. Bitcoin Core es la implementación de referencia. Otros ecosistemas incluyen btcd, bcoin, bitcoinj, bitcoinjs-lib, python-bitcoinlib, rust-bitcoin, libbitcoin, Electrum y BTCPay Server. Contribuciones útiles incluyen tests, documentación, herramientas de wallet, revisión, builds reproducibles y correcciones pequeñas.

### Proyectos sugeridos
Proyectos prácticos incluyen parser de bloques, indexador de transacciones, wallet testnet, depurador de Script, cliente SPV, estimador de comisiones, wallet basada en descriptors, entorno regtest, parser de invoices Lightning o escáner de filtros compactos. Cada proyecto debe probarse contra vectores conocidos y compararse byte a byte con Bitcoin Core cuando sea posible.

### Postura de aprendizaje
El hábito importante es reducir confianza. Empieza con APIs externas si hace falta, luego reemplázalas con parseo local, verificación local, datos UTXO locales y eventualmente un nodo completo. Programar Bitcoin premia la exactitud: orden de bytes, serialización, flags de consenso y casos borde importan tanto como la idea general.

