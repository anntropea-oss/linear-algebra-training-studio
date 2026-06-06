# Curriculum Skill Map

The system should treat linear algebra as a prerequisite graph, not a single ladder. Learners can be strong in computation while weak in geometry, or fluent with vectors while still fragile on subspaces.

## Stage 1: Orientation

### Vectors and Linear Combinations

- Prerequisites: none
- Learner can: form weighted sums, interpret coordinates, explain what a combination means.
- Evidence: solves combination equations and explains geometric meaning.
- Common mistakes: treats vectors as isolated coordinate pairs; loses scalar weights.

### Span

- Prerequisites: vectors and linear combinations
- Learner can: decide what a set of vectors can reach.
- Evidence: justifies whether vectors span a line, plane, or full space.
- Common mistakes: counts vectors without checking direction or redundancy.

### Linear Independence

- Prerequisites: span
- Learner can: detect redundancy using equations and geometry.
- Evidence: finds dependence relations and explains why extra vectors may not add dimension.
- Common mistakes: assumes nonzero vectors are independent.

## Stage 2: Systems

### Systems of Equations

- Prerequisites: vectors and linear combinations
- Learner can: solve small systems and interpret solution sets.
- Evidence: distinguishes unique, none, and infinitely many solutions.
- Common mistakes: solves mechanically without interpreting consistency.

### Row Reduction

- Prerequisites: systems
- Learner can: use legal row operations to find pivots, free variables, and rank.
- Evidence: row reduces augmented matrices and explains pivot structure.
- Common mistakes: uses operations that change the solution set.

### Matrix Operations

- Prerequisites: systems
- Learner can: multiply matrices and reason about dimensions.
- Evidence: predicts product shapes and computes row-column products.
- Common mistakes: multiplies entry-by-entry; ignores shape compatibility.

## Stage 3: Structure

### Subspaces

- Prerequisites: span, linear independence
- Learner can: verify zero vector, closure under addition, and closure under scalar multiplication.
- Evidence: accepts homogeneous solution sets and rejects shifted planes or lines.
- Common mistakes: checks only one condition; forgets the zero vector.

### Basis and Dimension

- Prerequisites: linear independence, row reduction
- Learner can: find efficient coordinate systems.
- Evidence: removes redundant vectors and builds bases for span, null space, and column space.
- Common mistakes: confuses number of listed vectors with dimension.

### Determinants

- Prerequisites: matrix operations
- Learner can: compute and interpret determinant as signed scale.
- Evidence: connects determinant zero to non-invertibility and dimension collapse.
- Common mistakes: treats determinant only as a formula.

## Stage 4: Geometry

### Linear Transformations

- Prerequisites: matrix operations, basis and dimension
- Learner can: connect matrices to transformations, kernels, and images.
- Evidence: uses matrix columns as images of basis vectors.
- Common mistakes: treats transformations as tables of numbers only.

### Orthogonality

- Prerequisites: vectors and linear combinations
- Learner can: use dot products for angle, length, and perpendicularity.
- Evidence: tests orthogonality in R^n and explains why orthogonal bases are useful.
- Common mistakes: relies on slope rules outside R^2.

### Projections and Least Squares

- Prerequisites: orthogonality, basis and dimension
- Learner can: project onto lines, planes, and column spaces.
- Evidence: computes projections and explains closest approximation.
- Common mistakes: copies coordinates instead of using dot products.

## Stage 5: Spectral

### Eigenvalues and Eigenvectors

- Prerequisites: determinants, linear transformations
- Learner can: find directions that remain on their own span.
- Evidence: solves characteristic equations and interprets eigenspaces.
- Common mistakes: thinks eigenvectors are unchanged instead of scaled.

### Diagonalization

- Prerequisites: eigenvalues and eigenvectors, basis and dimension
- Learner can: use eigenbases to simplify repeated transformations.
- Evidence: checks whether enough independent eigenvectors exist.
- Common mistakes: assumes every square matrix is diagonalizable.

## Mastery Bands

- 0-39: Repair needed. The learner needs diagnostic review and guided examples.
- 40-59: Fragile. The learner can start problems but needs targeted correction.
- 60-79: Developing. The learner can practice independently with review.
- 80-100: Secure. The learner should receive mixed review and transfer problems.
