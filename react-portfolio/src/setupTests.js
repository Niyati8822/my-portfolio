import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';

// Configure the testing library
configure({ testIdAttribute: 'data-test-id' });