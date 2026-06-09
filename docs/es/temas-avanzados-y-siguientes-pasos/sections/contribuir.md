<!-- order: 3 -->

## Contribuir

Bitcoin es software libre mantenido por la comunidad. Hay muchas formas de aportar sin ser experto en consenso:

- **Bitcoin Core**: revisión de PRs, pruebas, documentación, traducciones.
- **Librerías**: mejoras en clientes Python, Rust (`rust-bitcoin`), JS (`bitcoinjs-lib`).
- **Educación**: tutoriales, traducciones, correcciones a material como este.
- **BIPs**: propuestas de mejora bien documentadas cuando tienes un diseño claro.

Buenas prácticas al contribuir:

1. Empieza por issues etiquetados como *good first issue* o *help wanted*.
2. Comenta en el issue antes de abrir un PR grande.
3. Escribe pruebas que reproduzcan el bug o validen la feature.
4. Sigue las guías de estilo del repositorio (formato, commits, cobertura).

```python-sandbox
workflow = ["fork", "branch", "tests", "PR", "review", "merge"]
print(" -> ".join(workflow))
```

> [!TIP]
> La lista de correo bitcoin-dev y el IRC #bitcoin-core-dev son canales técnicos; para dudas de aprendizaje, Stack Exchange y meetups locales suelen ser más accesibles.

## Complemento de sección

Contribuir a proyectos Bitcoin tiene tanto de revisión y cautela como de escribir código. Los sistemas de consenso castigan ambigüedad, así que las buenas contribuciones suelen ser pequeñas, bien probadas y fáciles de razonar. Documentación, casos reproducibles y comentarios de revisión también son contribuciones valiosas.

Distintas implementaciones tienen metas distintas. Bitcoin Core prioriza seguridad de consenso y comportamiento de red. Las librerías pueden priorizar ergonomía de wallet, parseo o integración con un lenguaje. Elige objetivos cuyo nivel de riesgo coincida con tu comprensión actual.

