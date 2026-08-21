# Commands

| Command | Effect |
|---|---|
| `inv add <sku> <name> <qty> [--price <cents>]` | Create an item or increase its quantity |
| `inv remove <sku> <qty>` | Decrease quantity; errors if it would go below zero |
| `inv list` | Print every item as a table, sorted by SKU |
