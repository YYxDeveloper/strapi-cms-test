# Spec Delta

## ADDED Requirements

### Requirement: Category filter chips
The blog list SHALL show a row of text chips above the featured card: an "All" chip plus one chip per category found on the loaded articles. The active chip SHALL be underlined in `#67a0ea`. Each chip SHALL link to `/[locale]/blog?category=<slug>` and the list SHALL show only articles in that category.

#### Scenario: Filter by category
- **WHEN** a visitor clicks a category chip on `/en/blog`
- **THEN** the URL gains `?category=<slug>`, that chip is underlined, and only articles of that category are listed

#### Scenario: Unknown category
- **WHEN** a visitor opens `/en/blog?category=does-not-exist`
- **THEN** all articles are listed and the "All" chip is active

### Requirement: Featured article card
The blog list SHALL render the newest article as a full-width featured card with a 2:1 image on top, then category chips, title, description and date.

#### Scenario: Featured card on blog list
- **WHEN** a visitor opens `/en/blog` and at least one article exists
- **THEN** the first element of the list is a full-width card showing the newest article with a 2:1 image

#### Scenario: Single article
- **WHEN** only one article exists
- **THEN** only the featured card renders and no empty grid is shown

### Requirement: Compact article card
Articles after the featured one SHALL render as compact cards with a ~4:3 image on top, then category chip, title and date.

#### Scenario: Compact card layout
- **WHEN** a visitor opens `/en/blog` with more than one article
- **THEN** every article except the newest renders as a compact card with the image above the text

#### Scenario: Card without image
- **WHEN** an article has no image
- **THEN** the card still renders with an empty rounded image area and no layout error

## MODIFIED Requirements

### Requirement: Two-column blog grid
The blog list SHALL show the featured card full width, followed by the remaining articles in a grid of one column below the `sm` breakpoint, two columns from `sm`, and three columns from `lg`.

#### Scenario: Wide viewport
- **WHEN** the viewport is at least the `lg` breakpoint
- **THEN** compact cards are laid out in three columns under the full-width featured card

#### Scenario: Medium viewport
- **WHEN** the viewport is between `sm` and `lg`
- **THEN** compact cards are laid out in two columns

#### Scenario: Narrow viewport
- **WHEN** the viewport is below the `sm` breakpoint
- **THEN** all cards are laid out in a single column
