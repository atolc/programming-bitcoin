<!-- order: 7 -->

## Otras mejoras de SegWit

SegWit no es solo nuevas direcciones. Trajo cambios estructurales al protocolo:

**Límite de peso del bloque.** Sustituye el límite de 1 MB por **4 millones de weight units**. Datos en witness cuentan menos, permitiendo más transacciones sin aumentar el trabajo de validación de nodos antiguos.

**Compromiso de witness.** Cada bloque incluye un `witness commitment` en la coinbase: un hash Merkle de los wtxid conectado al `coinbase witness`, lo que hace costoso ocultar datos witness alterados.

**Corrección de maleabilidad.** Al excluir el witness del txid, un tercero ya no puede cambiar la firma para alterar el identificador de la transacción antes de confirmarse.

```python-sandbox
MAX_BLOCK_WEIGHT = 4_000_000
legacy_tx_bytes = 250
witness_bytes = 107
weight = legacy_tx_bytes * 4 + witness_bytes
print(f"Weight tx ejemplo: {weight}")
print(f"Tx similares por bloque (max): ~{MAX_BLOCK_WEIGHT // weight}")
```

**Versiones futuras.** El byte de versión del witness program (`OP_0` hoy) deja espacio para nuevos esquemas (Taproot usa versión 1).

> [!TIP]
> Los nodos que no entienden SegWit siguen viendo transacciones válidas: los campos witness parecen vacíos y el txid legacy coincide con lo que esperan para el árbol Merkle clásico.

## Complemento de sección

SegWit también cambia la contabilidad de bloques mediante unidades de peso. Los datos no witness pesan más que los witness, permitiendo más rendimiento efectivo mientras conserva compatibilidad con nodos antiguos. El compromiso witness en coinbase ata el bloque a los datos witness para que mineros no puedan omitirlos o alterarlos.

El versionado de scripts es otra mejora a largo plazo. Los programas witness versionados crean una ruta más limpia para futuros sistemas de script, que es como mejoras posteriores como Taproot encajan en Bitcoin sin reemplazar todo el formato de transacción.

