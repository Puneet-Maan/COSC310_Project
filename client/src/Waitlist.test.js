import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Waitlist from './Waitlist';

// Mock axios
jest.mock('axios');

describe('Waitlist Component', () => {
  const mockWaitlist = [
    { waitlist_id: 1, studentId: 'S1234567', sectionId: '2' },
    { waitlist_id: 2, studentId: 'S1234568', sectionId: '1' }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockWaitlist });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the waitlist component', async () => {
    render(<Waitlist />);

    // Check if the header is rendered
    expect(screen.getByText('Student Waitlist')).toBeInTheDocument();

    // Check if the table headers are rendered
    expect(screen.getByText('Student ID')).toBeInTheDocument();
    expect(screen.getByText('Section ID')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Wait for the waitlist data to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('S1234567')).toBeInTheDocument();
      expect(screen.getByText('S1234568')).toBeInTheDocument();
    });
  });

  it('should add a new waitlist entry', async () => {
    render(<Waitlist />);

    axios.post.mockResolvedValue({
      data: { waitlist_id: 3, studentId: 'S1234569', sectionId: '3' }
    });

    // Fill out the form and submit
    fireEvent.change(screen.getByPlaceholderText('Student ID'), { target: { value: 'S1234569' } });
    fireEvent.change(screen.getByPlaceholderText('Section ID'), { target: { value: '3' } });
    fireEvent.click(screen.getByText('Add to Waitlist'));

    // Wait for the new entry to be added to the list
    await waitFor(() => {
      expect(screen.getByText('S1234569')).toBeInTheDocument();
    });
  });

  it('should delete a waitlist entry', async () => {
    render(<Waitlist />);

    axios.delete.mockResolvedValue({});

    // Wait for the waitlist data to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('S1234567')).toBeInTheDocument();
    });

    // Delete an entry
    fireEvent.click(screen.getAllByText('Delete')[0]);

    // Wait for the entry to be removed from the list
    await waitFor(() => {
      expect(screen.queryByText('S1234567')).not.toBeInTheDocument();
    });
  });

  it('should edit a waitlist entry', async () => {
    render(<Waitlist />);

    axios.delete.mockResolvedValue({});
    axios.post.mockResolvedValue({
      data: { waitlist_id: 1, studentId: 'S1234567', sectionId: '3' }
    });

    // Wait for the waitlist data to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('S1234567')).toBeInTheDocument();
    });

    // Edit an entry
    fireEvent.click(screen.getAllByText('Edit')[0]);
    fireEvent.change(screen.getByPlaceholderText('Section ID'), { target: { value: '3' } });
    fireEvent.click(screen.getByText('Add to Waitlist'));

    // Wait for the edited entry to be updated in the list
    await waitFor(() => {
      expect(screen.getByText('S1234567')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});
