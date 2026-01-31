# System Architecture

## Overview
The Tax-Loss Shadow application is a client-side heavy Next.js application that processes sensitive financial data locally where possible (or via secure API stubs).

## Components

### 1. Data Layer (Agent A)
- **Files**: `src/services/dataService.ts`
- **Purpose**: Ingests transactions, normalizes data, handles API communication (mocked for now).

### 2. Logic Layer (Agent B)
- **Files**: `src/lib/taxCalculator.ts`
- **Purpose**: Pure functions for Indian tax calculation.
- **Inputs**: List of transactions, Income details.
- **Outputs**: Tax liability, recommendations.

### 3. Presentation Layer (Agent C)
- **Files**: `src/components/*`, `src/pages/*`
- **Purpose**: Visualizes data using Recharts and Tailwind UI.

## Data Flow
`Page` -> `DataService` (Fetch) -> `TaxCalculator` (Process) -> `Dashboard` (Render)
