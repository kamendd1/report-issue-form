import styled from '@emotion/styled';

export const FormContainer = styled.div`
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem;
  box-sizing: border-box;
`;

export const FormGroup = styled.div`
  margin-bottom: 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-sizing: border-box;
  padding: 0;
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.375rem;
  font-weight: 500;
  color: #334155;
  font-size: 0.875rem;
  text-transform: none;
  font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
`;

export const FormInput = styled.input`
  padding: 0.5rem 0;
  border: none;
  border-bottom: 1px solid #cbd5e1;
  border-radius: 0;
  box-sizing: border-box;
  font-size: 0.875rem;
  font-weight: 400;
  background-color: #fff;
  color: #1e293b;
  transition: all 0.15s ease;
  font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
  width: 100%;
  box-shadow: none;

  &:focus {
    outline: none;
    border-bottom-color: #2563eb;
    box-shadow: none;
  }

  &:hover {
    border-bottom-color: #94a3b8;
  }

  &::placeholder {
    font-size: 0.875rem;
    opacity: 1;
    color: #94a3b8;
    font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
  }

  &.error {
    border-bottom-color: #dc2626 !important;
  }
`;

export const FormSelect = styled.select`
  padding: 0.5rem 0;
  border: none;
  border-bottom: 1px solid #cbd5e1;
  border-radius: 0;
  box-sizing: border-box;
  font-size: 0.875rem;
  font-weight: 400;
  background-color: #fff;
  color: #1e293b;
  transition: all 0.15s ease;
  font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
  width: 100%;
  box-shadow: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right -0.25rem center;
  background-repeat: no-repeat;
  background-size: 1rem;
  padding-right: 1.25rem;
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &:focus {
    outline: none;
    border-bottom-color: #2563eb;
    box-shadow: none;
  }

  &:hover {
    border-bottom-color: #94a3b8;
  }

  &.error {
    border-bottom-color: #dc2626 !important;
  }

  & option {
    color: #1e293b;
    background: #fff;
    font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
    padding: 0.5rem 0;
    font-size: 0.875rem;
  }
`;

export const FormTextarea = styled.textarea`
  padding: 0.5rem 0;
  border: none;
  border-bottom: 1px solid #cbd5e1;
  border-radius: 0;
  box-sizing: border-box;
  font-size: 0.875rem;
  font-weight: 400;
  background-color: #fff;
  color: #1e293b;
  transition: all 0.15s ease;
  font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
  width: 100%;
  box-shadow: none;
  min-height: 100px;
  resize: vertical;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-bottom-color: #2563eb;
    box-shadow: none;
  }

  &:hover {
    border-bottom-color: #94a3b8;
  }

  &::placeholder {
    font-size: 0.875rem;
    opacity: 1;
    color: #94a3b8;
    font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
  }

  &.error {
    border-bottom-color: #dc2626 !important;
  }
`;

export const FormButton = styled.button`
  background-color: #2563eb;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
  width: 100%;

  &:hover {
    background-color: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  }

  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const FormHeading = styled.h2`
  font-size: 1.875rem;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.025em;
  margin: 0 0 0.5rem 0;
  text-transform: none;
  font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
`;

export const FormDescription = styled.p`
  color: #64748b;
  font-size: 1rem;
  line-height: 1.75;
  font-weight: 400;
  margin: 0 0 1.5rem 0;
  font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
`;

export const FormError = styled.span`
  display: block;
  color: #dc2626;
  font-size: 0.8125rem;
  margin-top: 0.25rem;
  font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
`;

export const FormRequired = styled.span`
  color: #dc2626;
  margin-left: 2px;
`;

export const FormOptional = styled.span`
  margin-left: 4px;
  font-weight: 400;
  color: #64748b;
  font-size: 0.8125rem;
  font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
`;

export const FormCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 1.5rem;

  & input[type="checkbox"] {
    width: 1.125rem;
    height: 1.125rem;
    margin: 0;
    accent-color: #2563eb;
    cursor: pointer;
    flex-shrink: 0;
  }

  & label {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: #475569;
    font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
    padding-top: 0.125rem;
  }
`;

export const FormLink = styled.a`
  color: #2563eb;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const FormWrapper = styled.form`
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

export const FormAlert = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  background-color: ${props => 
    props.type === 'error' ? '#fee2e2' : 
    props.type === 'success' ? '#f0fdf4' : 
    props.type === 'warning' ? '#fffbeb' : '#f0f9ff'};
  color: ${props => 
    props.type === 'error' ? '#b91c1c' : 
    props.type === 'success' ? '#166534' : 
    props.type === 'warning' ? '#92400e' : '#0369a1'};
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const ChargerInfoAlert = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  color: #b91c1c;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 2.5rem 0;
  text-align: left;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
  align-items: center;
  gap: 0.75rem;
`;
