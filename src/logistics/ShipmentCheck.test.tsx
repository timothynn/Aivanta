import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ShipmentCheck } from './ShipmentCheck';

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it('gates export behind review and invalidates approval when source documents change', () => {
  render(<ShipmentCheck />);
  const download = screen.getByRole('button', { name: 'Download reviewed JSON' });
  expect(download).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Check shipment file' }));
  expect(screen.getByRole('status')).toHaveTextContent('1 fields need attention');
  fireEvent.change(screen.getByLabelText('Reviewer name'), { target: { value: 'Demo Reviewer' } });
  fireEvent.change(screen.getByLabelText('Review note for packages'), { target: { value: 'Demo correction confirmed by the shipment owner.' } });
  for (const checkbox of screen.getAllByRole('checkbox')) fireEvent.click(checkbox);
  expect(download).toBeEnabled();
  const create = vi.fn().mockReturnValue('blob:sample');
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: create });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  fireEvent.click(download);
  expect(create).toHaveBeenCalledOnce();
  expect(screen.getByText(/Reviewed synthetic shipment exported/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Commercial invoice text'), { target: { value: 'Shipment reference: changed' } });
  expect(download).toBeDisabled();
  expect(screen.queryByText(/Reviewed synthetic shipment exported/)).not.toBeInTheDocument();
});

it('requires fresh approval and a note when an agreed value is edited', () => {
  render(<ShipmentCheck />);
  fireEvent.change(screen.getByLabelText('Example scenario'), { target: { value: 'matched' } });
  fireEvent.click(screen.getByRole('button', { name: 'Check shipment file' }));
  fireEvent.change(screen.getByLabelText('Reviewer name'), { target: { value: 'Demo Reviewer' } });
  for (const checkbox of screen.getAllByRole('checkbox')) fireEvent.click(checkbox);
  fireEvent.change(screen.getByLabelText('Reviewed packages'), { target: { value: '121' } });
  expect(screen.getByLabelText('I reviewed packages')).not.toBeChecked();
  fireEvent.click(screen.getByLabelText('I reviewed packages'));
  expect(screen.getByRole('button', { name: 'Download reviewed JSON' })).toBeDisabled();
});
