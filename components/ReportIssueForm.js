'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from '../styles/Form.module.css';

const issueTypes = [
  { label: 'Charging session issues (Required Charger Label and/or location)', value: 'charging_session' },
  { label: 'Payment issues', value: 'payment' },
  { label: 'Autocharge issue', value: 'autocharge' },
  { label: 'RFID issue', value: 'rfid' },
  { label: 'Account validation issues', value: 'account_validation' },
  { label: 'Inaccurate charger position on the map (Required Charger Label and/or location)', value: 'inaccurate_position' },
  { label: 'Charger is not available/unfunctional (Required Charger Label or connector)', value: 'unavailable_charger' },
  { label: 'Damaged charger/connector (Required Charger Label & connector)', value: 'damaged_charger' },
  { label: 'Wrong Charger Power Capacity in the App (Required Charger Label and/or location)', value: 'wrong_power_capacity' },
  { label: 'Wrong Connector Type in the App (Required Charger Label and/or location)', value: 'wrong_connector_type' },
  { label: 'Missing/Wrong price information in the App (Required Charger Label and/or location / Related Tariff AC/DC)', value: 'wrong_price_info' },
  { label: 'Other issue (Please specify)', value: 'other' },
];

const operators = [
  { label: 'Select a country', value: '' },
  { label: 'Eldrive Bulgaria', value: 'BG' },
  { label: 'Eldrive Romania', value: 'RO' },
  { label: 'Eldrive Lithuania', value: 'LT' },
];

// Helper function to check if issue type requires charger info
const requiresChargerInfo = (type) => {
  return [
    'charging_session',
    'inaccurate_position',
    'unavailable_charger',
    'damaged_charger',
    'wrong_power_capacity',
    'wrong_connector_type',
    'wrong_price_info'
  ].includes(type);
};

// Helper function to check if issue type requires connector info
const requiresConnectorInfo = (type) => {
  return [
    'unavailable_charger',
    'damaged_charger',
    'wrong_connector_type'
  ].includes(type);
};

// Country codes for phone input
const COUNTRY_CODES = {
  BG: {
    code: '+359',
    pattern: '^[0-9]{9}$',
    example: '888123456',
    flag: '🇧🇬',
    name: 'Bulgaria'
  },
  RO: {
    code: '+40',
    pattern: '^[0-9]{9}$',
    example: '712345678',
    flag: '🇷🇴',
    name: 'Romania'
  },
  LT: {
    code: '+370',
    pattern: '^[0-9]{8}$',
    example: '61234567',
    flag: '🇱🇹',
    name: 'Lithuania'
  }
};

// Form validation schema using Yup
const schema = yup.object().shape({
  operator: yup.string().required('Operator is required'),
  issueType: yup.string().required('Issue type is required'),
  otherIssueDescription: yup.string().when('issueType', {
    is: 'other',
    then: () => yup.string().required('Please specify the issue').min(10, 'Please provide at least 10 characters'),
    otherwise: () => yup.string()
  }),
  chargerLabel: yup.string().when('issueType', {
    is: (val) => requiresChargerInfo(val),
    then: () => yup.string().required('Charger label is required'),
    otherwise: () => yup.string()
  }),
  chargerLocation: yup.string().when('issueType', {
    is: (val) => requiresChargerInfo(val),
    then: () => yup.string().required('Charger location is required'),
    otherwise: () => yup.string()
  }),
  connectorType: yup.string().when('issueType', {
    is: (val) => requiresConnectorInfo(val),
    then: () => yup.string().required('Connector type is required'),
    otherwise: () => yup.string()
  }),
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email address (e.g., name@example.com)'),
  dateOfIssue: yup.string().required('Date of issue is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  stationId: yup.string(),
  description: yup.string().required('Description is required')
    .min(20, 'Description must be at least 20 characters'),
  name: yup.string()
    .required('Name is required')
    .test('valid-name', 'Please enter both your first name and surname', 
      value => value ? value.trim().split(/\s+/).length >= 2 : false)
    .test('name-length', 'Each name must be at least 2 characters long', 
      value => value ? !value.trim().split(/\s+/).some(part => part.length < 2) : false)
    .test('name-chars', 'Names can only contain letters, spaces, and hyphens', 
      value => value ? /^[A-Za-z\s-]+$/.test(value) : false),
  phoneCountry: yup.string().required('Country code is required'),
  phoneNumber: yup.string()
    .required('Phone number is required')
    .test('valid-phone', 'Please enter a valid phone number', function(value) {
      const { phoneCountry } = this.parent;
      if (!value || !phoneCountry) return false;
      
      const countryInfo = COUNTRY_CODES[phoneCountry];
      if (!countryInfo) return false;
      
      const regex = new RegExp(countryInfo.pattern);
      return regex.test(value);
    }),
  location: yup.string().required('Location is required'),
  consent: yup.boolean().oneOf([true], 'You must agree to the terms'),
});

export default function ReportIssueForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Custom validation state
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      operator: '',
      issueType: '',
      otherIssueDescription: '',
      chargerLabel: '',
      chargerLocation: '',
      connectorType: '',
      email: '',
      dateOfIssue: '',
      stationId: '',
      description: '',
      name: '',
      phoneCountry: 'BG',
      phoneNumber: '',
      location: '',
      consent: false,
    },
  });
  
  // Watch the issueType to conditionally show fields
  const selectedIssueType = watch('issueType');
  const selectedPhoneCountry = watch('phoneCountry');

  // Format phone number based on country
  const formatPhoneNumber = (value, country) => {
    const countryInfo = COUNTRY_CODES[country];
    if (!countryInfo) return value;
    
    const digitsOnly = value.replace(/\D/g, '');
    const maxLength = country === 'LT' ? 8 : 9;
    return digitsOnly.slice(0, maxLength);
  };

  // Validate phone number
  const validatePhoneNumber = (number, country) => {
    if (!number || !country) {
      setPhoneError('Phone number is required');
      return false;
    }
    
    const countryInfo = COUNTRY_CODES[country];
    if (!countryInfo) {
      setPhoneError('Invalid country code');
      return false;
    }
    
    const regex = new RegExp(countryInfo.pattern);
    if (!regex.test(number)) {
      setPhoneError(`Please enter a valid phone number (e.g., ${countryInfo.example})`);
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  // Handle phone number input change
  const handlePhoneChange = (e, field) => {
    const value = e.target.value;
    const formattedNumber = formatPhoneNumber(value, selectedPhoneCountry);
    field.onChange(formattedNumber);
    validatePhoneNumber(formattedNumber, selectedPhoneCountry);
  };

  // Handle country code change
  const handleCountryChange = (e, field) => {
    const newCountry = e.target.value;
    field.onChange(newCountry);
    setValue('phoneNumber', ''); // Clear phone number when country changes
    setPhoneError(''); // Clear any existing phone errors
  };

  // Validate email
  const validateEmail = (email) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address (e.g., name@example.com)');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  // Validate name
  const validateName = (name) => {
    if (!name) {
      setNameError('Name is required');
      return false;
    }
    
    const names = name.trim().split(/\s+/);
    if (names.length < 2) {
      setNameError('Please enter both your first name and surname');
      return false;
    }
    
    if (names.some(part => part.length < 2)) {
      setNameError('Each name must be at least 2 characters long');
      return false;
    }
    
    if (!/^[A-Za-z\s-]+$/.test(name)) {
      setNameError('Names can only contain letters, spaces, and hyphens');
      return false;
    }
    
    setNameError('');
    return true;
  };

  // Validate name on change
  const handleNameChange = (e, field) => {
    const value = e.target.value;
    field.onChange(value);
    validateName(value);
  };

  // Validate email on change
  const handleEmailChange = (e, field) => {
    const value = e.target.value;
    field.onChange(value);
    validateEmail(value);
  };

  // Reset conditional fields when issue type changes
  const handleIssueTypeChange = (e, field) => {
    const value = e.target.value;
    field.onChange(value);

    // Reset charger info fields if not required
    if (!requiresChargerInfo(value)) {
      setValue('chargerLabel', '');
      setValue('chargerLocation', '');
    }

    // Reset connector type if not required
    if (!requiresConnectorInfo(value)) {
      setValue('connectorType', '');
    }

    // Reset other issue description if not "other"
    if (value !== 'other') {
      setValue('otherIssueDescription', '');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    // Additional validation checks
    let hasErrors = false;

    // Validate name format
    const names = data.name.trim().split(/\s+/);
    if (names.length < 2) {
      setValue('name', data.name, { shouldValidate: true });
      hasErrors = true;
    } else if (names.some(part => part.length < 2)) {
      setValue('name', data.name, { shouldValidate: true });
      hasErrors = true;
    } else if (!/^[A-Za-z\s-]+$/.test(data.name)) {
      setValue('name', data.name, { shouldValidate: true });
      hasErrors = true;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setValue('email', data.email, { shouldValidate: true });
      hasErrors = true;
    }

    // Validate phone number
    const countryInfo = COUNTRY_CODES[data.phoneCountry];
    if (countryInfo) {
      const phoneRegex = new RegExp(countryInfo.pattern);
      if (!phoneRegex.test(data.phoneNumber)) {
        setValue('phoneNumber', data.phoneNumber, { shouldValidate: true });
        hasErrors = true;
      }
    }

    // Don't proceed if there are validation errors
    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/submit-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          // Format phone number with country code for submission
          phoneNumber: `${COUNTRY_CODES[data.phoneCountry].code}${data.phoneNumber}`
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Use window.location for client-side navigation
        window.location.href = `/success?ticket=${result.ticketNumber}`;
      } else {
        throw new Error(result.error || 'Failed to submit issue');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Report an Issue</h2>
      <p>
        Having trouble with the Eldrive services? We're here to help! This form allows you to quickly report any
        issues you encounter while using the app.
      </p>
      
      <h3>Before you report:</h3>
      <ul>
        <li>
          Check our Help Center: Many common issues can be resolved by reviewing the FAQ. You can
          find them within the app or by visiting our <a href="#" className={styles.link}>Help page</a>.
        </li>
        <li>
          Restart the app: Sometimes, a simple restart can fix temporary glitches.
        </li>
      </ul>
      
      <h3>Ready to report?</h3>
      <p>
        Please fill out the form below with as much detail as possible. This will help us identify and resolve the
        issue faster.
      </p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.formGroup}>
          <label htmlFor="operator">
            Country <span className={styles.required}>*</span>
          </label>
          <Controller
            name="operator"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="operator"
                className={`${styles.select} ${errors.operator ? styles.errorInput : ''}`}
              >
                {operators.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.operator && <span className={styles.error}>{errors.operator.message}</span>}
          <span className={styles.inputInstruction}>To which country operator you would like to report the issue</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="issueType">
            Issue Type <span className={styles.required}>*</span>
          </label>
          <Controller
            name="issueType"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="issueType"
                onChange={(e) => handleIssueTypeChange(e, field)}
                className={`${styles.select} ${errors.issueType ? styles.errorInput : ''}`}
              >
                <option value="">Select an issue type</option>
                {issueTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.issueType && <span className={styles.error}>{errors.issueType.message}</span>}
          <span className={styles.inputInstruction}>Select the type of issue you're experiencing</span>
        </div>

        {selectedIssueType === 'other' && (
          <div className={styles.formGroup}>
            <label htmlFor="otherIssueDescription">
              Issue Description <span className={styles.required}>*</span>
            </label>
            <Controller
              name="otherIssueDescription"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="otherIssueDescription"
                  className={`${styles.textarea} ${errors.otherIssueDescription ? styles.errorInput : ''}`}
                />
              )}
            />
            {errors.otherIssueDescription && <span className={styles.error}>{errors.otherIssueDescription.message}</span>}
            <span className={styles.inputInstruction}>Please provide details about your issue</span>
          </div>
        )}

        {requiresChargerInfo(selectedIssueType) && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="chargerLabel">
                Charger Label/ID <span className={styles.required}>*</span>
              </label>
              <Controller
                name="chargerLabel"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="chargerLabel"
                    className={`${styles.input} ${errors.chargerLabel ? styles.errorInput : ''}`}
                  />
                )}
              />
              {errors.chargerLabel && <span className={styles.error}>{errors.chargerLabel.message}</span>}
              <span className={styles.inputInstruction}>Enter the label or ID of the charger (e.g., RO-123)</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="chargerLocation">
                Charger Location <span className={styles.required}>*</span>
              </label>
              <Controller
                name="chargerLocation"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="chargerLocation"
                    className={`${styles.input} ${errors.chargerLocation ? styles.errorInput : ''}`}
                  />
                )}
              />
              {errors.chargerLocation && <span className={styles.error}>{errors.chargerLocation.message}</span>}
              <span className={styles.inputInstruction}>Enter the location of the charger (e.g., Mall parking lot, Sofia)</span>
            </div>
          </>
        )}

        {requiresConnectorInfo(selectedIssueType) && (
          <div className={styles.formGroup}>
            <label htmlFor="connectorType">
              Connector Type <span className={styles.required}>*</span>
            </label>
            <Controller
              name="connectorType"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="connectorType"
                  className={`${styles.select} ${errors.connectorType ? styles.errorInput : ''}`}
                >
                  <option value="">Select connector type</option>
                  <option value="type2">Type 2</option>
                  <option value="ccs">CCS</option>
                  <option value="chademo">CHAdeMO</option>
                </select>
              )}
            />
            {errors.connectorType && <span className={styles.error}>{errors.connectorType.message}</span>}
            <span className={styles.inputInstruction}>Select the type of connector involved in the issue</span>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="name">
            Name <span className={styles.required}>*</span>
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="name"
                onChange={(e) => handleNameChange(e, field)}
                className={`${styles.input} ${errors.name || nameError ? styles.errorInput : ''}`}
              />
            )}
          />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
          {!errors.name && nameError && <span className={styles.error}>{nameError}</span>}
          <span className={styles.inputInstruction}>Enter your first name and surname</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">
            Email <span className={styles.required}>*</span>
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                id="email"
                onChange={(e) => handleEmailChange(e, field)}
                className={`${styles.input} ${errors.email || emailError ? styles.errorInput : ''}`}
              />
            )}
          />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
          {!errors.email && emailError && <span className={styles.error}>{emailError}</span>}
          <span className={styles.inputInstruction}>Enter your email address for communication</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">
            Phone Number <span className={styles.required}>*</span>
          </label>
          <div className={styles.phoneGroup}>
            <Controller
              name="phoneCountry"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="phoneCountry"
                  onChange={(e) => handleCountryChange(e, field)}
                  className={`${styles.select} ${errors.phoneCountry ? styles.errorInput : ''}`}
                >
                  <option value="BG">{COUNTRY_CODES.BG.flag} {COUNTRY_CODES.BG.code}</option>
                  <option value="RO">{COUNTRY_CODES.RO.flag} {COUNTRY_CODES.RO.code}</option>
                  <option value="LT">{COUNTRY_CODES.LT.flag} {COUNTRY_CODES.LT.code}</option>
                </select>
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="tel"
                  id="phoneNumber"
                  onChange={(e) => handlePhoneChange(e, field)}
                  className={`${styles.input} ${styles.phoneInput} ${errors.phoneNumber || phoneError ? styles.errorInput : ''}`}
                  inputMode="numeric"
                />
              )}
            />
          </div>
          {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber.message}</span>}
          {!errors.phoneNumber && phoneError && <span className={styles.error}>{phoneError}</span>}
          <span className={styles.inputInstruction}>Example: {COUNTRY_CODES[selectedPhoneCountry]?.example}</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location">
            Location <span className={styles.required}>*</span>
          </label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="location"
                className={`${styles.input} ${errors.location ? styles.errorInput : ''}`}
              />
            )}
          />
          {errors.location && <span className={styles.error}>{errors.location.message}</span>}
          <span className={styles.inputInstruction}>Enter your current location or city</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dateOfIssue">
            Date of Issue <span className={styles.required}>*</span>
          </label>
          <Controller
            name="dateOfIssue"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                id="dateOfIssue"
                className={`${styles.input} ${errors.dateOfIssue ? styles.errorInput : ''}`}
                max={new Date().toISOString().split('T')[0]}
              />
            )}
          />
          {errors.dateOfIssue && <span className={styles.error}>{errors.dateOfIssue.message}</span>}
          <span className={styles.inputInstruction}>Select the date when the issue occurred</span>
        </div>

        {!requiresChargerInfo(selectedIssueType) && (
          <div className={styles.formGroup}>
            <label htmlFor="stationId">
              Station ID <span className={styles.optional}>(optional)</span>
            </label>
            <Controller
              name="stationId"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="stationId"
                  className={styles.input}
                />
              )}
            />
            <span className={styles.inputInstruction}>Enter the station ID if available (found on a label at the station)</span>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="description">
            Describe the Issue <span className={styles.required}>*</span>
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="description"
                className={`${styles.textarea} ${errors.description ? styles.errorInput : ''}`}
                rows={4}
              />
            )}
          />
          {errors.description && <span className={styles.error}>{errors.description.message}</span>}
          <span className={styles.inputInstruction}>Provide a clear and detailed description of the problem you're experiencing. The more information you give us, the easier it will be for us to diagnose and fix the issue.</span>
        </div>

        <div className={styles.formGroup}>
          <label>
            <svg 
              className={styles.icon} 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Screenshots or Photos <span className={styles.optional}>(optional)</span>
          </label>
          <div className={styles.fileInputWrapper}>
            <button type="button" className={styles.fileButton} onClick={() => document.getElementById('screenshots').click()}>
              Choose Files
            </button>
            <span className={styles.fileText}>No files selected</span>
            <input
              id="screenshots"
              type="file"
              multiple
              onChange={(e) => {
                const fileCount = e.target.files?.length || 0;
                const fileText = document.querySelector(`.${styles.fileText}`);
                if (fileText) {
                  fileText.textContent = fileCount === 0 
                    ? 'No files selected' 
                    : fileCount === 1 
                      ? '1 file selected'
                      : `${fileCount} files selected`;
                }
              }}
              className={styles.input}
            />
          </div>
          <span className={styles.inputInstruction}>Attach any screenshots or photos that may help illustrate the issue</span>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.checkboxGroup}>
            <Controller
              name="consent"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="checkbox"
                  id="consent"
                  className={styles.checkbox}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            <label htmlFor="consent" className={styles.checkboxLabel}>
              By checking this box, you consent to Eldrive processing your personal data as described in our <a href="#" className={styles.link}>Privacy Policy</a> for the purpose of addressing your reported issue.
            </label>
          </div>
          {errors.consent && <span className={styles.error}>{errors.consent.message}</span>}
          <span className={`${styles.inputInstruction} ${styles.displayBlock}`}>You may withdraw your consent at any time</span>
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Issue'}
        </button>

        {submitStatus.type === 'error' && (
          <div className={styles.error}>
            {submitStatus.message}
          </div>
        )}
      </form>
      
      {snackbar.open && (
        <div className={`${styles.alert} ${snackbar.severity === 'error' ? styles.alertError : styles.alertSuccess}`}>
          {snackbar.message}
        </div>
      )}
      
      {submitStatus.message && (
        <div className={`${styles.alert} ${submitStatus.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
          {submitStatus.message}
        </div>
      )}
    </div>
  );
}
