<!-- order: 3 -->

## Contributing

Bitcoin is free software maintained by the community. There are many ways to contribute without being a consensus expert:

- **Bitcoin Core**: PR review, testing, documentation, translations.
- **Libraries**: improvements to Python clients, Rust (`rust-bitcoin`), JS (`bitcoinjs-lib`).
- **Education**: tutorials, translations, corrections to material like this.
- **BIPs**: well-documented improvement proposals when you have a clear design.

Good practices when contributing:

1. Start with issues labeled *good first issue* or *help wanted*.
2. Comment on the issue before opening a large PR.
3. Write tests that reproduce the bug or validate the feature.
4. Follow the repository style guide (formatting, commits, coverage).

```python-sandbox
workflow = ["fork", "branch", "tests", "PR", "review", "merge"]
print(" -> ".join(workflow))
```

> [!TIP]
> The bitcoin-dev mailing list and IRC #bitcoin-core-dev are technical channels; for learning questions, Stack Exchange and local meetups are usually more accessible.
