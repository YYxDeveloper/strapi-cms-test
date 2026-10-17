# Spec Delta

## Purpose
Defines the visual theme of blog list cards and the article hero in the Nuxt frontend, modeled on the FlexiBlog Agency theme.

## ADDED Requirements

### Requirement: Horizontal accent article card
Each blog article card SHALL render as a horizontal card with the thumbnail on the left, text on the right, a 16px corner radius, a 4px left border in the accent color `#67a0ea`, and a surface color of `#181a1b` when rendered outside the blog light scope, and white inside it.

#### Scenario: Card layout on blog list
- **WHEN** a visitor opens `/en/blog`
- **THEN** every article card shows a thumbnail on the left and title, categories and description on the right
- **AND** the card has a 4px `#67a0ea` left border

#### Scenario: Card without image
- **WHEN** an article has no image
- **THEN** the card still renders with an empty rounded thumbnail area and no layout error

### Requirement: Two-column blog grid
The blog list SHALL show articles in one column below the `lg` breakpoint and two columns at `lg` and above.

#### Scenario: Wide viewport
- **WHEN** the viewport is at least the `lg` breakpoint
- **THEN** article cards are laid out in two columns

#### Scenario: Narrow viewport
- **WHEN** the viewport is below the `lg` breakpoint
- **THEN** article cards are laid out in a single column

### Requirement: Plain rounded article hero
The article detail hero image SHALL be displayed with a 16px corner radius and no fade mask.

#### Scenario: Article detail page
- **WHEN** a visitor opens an article with an image
- **THEN** the hero image is fully visible with rounded corners and no radial transparency

### Requirement: Light blog pages
The blog list and article detail pages SHALL render inside a `.blog-light` scope with a `#f4f6f8` page background and dark text, while the navbar stays dark and cards rendered outside the scope remain dark.

#### Scenario: Blog list in light mode
- **WHEN** a visitor opens `/en/blog` or `/fr/blog`
- **THEN** the page background is `#f4f6f8`, article cards are white and the navbar is dark

#### Scenario: Article detail in light mode
- **WHEN** a visitor opens an article
- **THEN** the page background is `#f4f6f8`, the title is dark and the body is not inverted
