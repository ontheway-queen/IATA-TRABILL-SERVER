export const pnrDetails = {
  startDate: '2024-02-09',
  endDate: '2024-02-13',
  isTicketed: true,
  creationDetails: {
    creationUserSine: 'AWS',
    creationDate: '2024-01-01',
    creationTime: '23:07',
    userWorkPcc: 'N4PL',
    userHomePcc: 'N4PL',
    primeHostId: '1B',
  },
  contactInfo: {
    phones: ['01705511718-H-1.1', '01705511718-H-2.1'],
  },
  travelers: [
    {
      givenName: 'NAZMUL',
      surname: 'AHMED',
      type: 'ADULT',
      passengerCode: 'ADT',
      emails: ['NAZMUL.M360ICT@GMAIL.COM'],
      phones: [
        {
          number: '01705511718',
          label: 'H',
        },
      ],
      identityDocuments: [
        {
          documentType: 'SECURE_FLIGHT_PASSENGER_DATA',
          givenName: 'NAZMUL',
          surname: 'AHMED',
          birthDate: '1990-01-01',
          gender: 'MALE',
          itemId:
            'd25ad406e6b29492ff0eac297844a76880055a9c82fc89484d336fee016dd6d06db3a31cf93d1a18b0492b43a1a4d781f769c6196af6458943f3ef6931e75e94',
        },
      ],
    },
    {
      givenName: 'MOON',
      surname: 'AHMED',
      type: 'ADULT',
      passengerCode: 'ADT',
      emails: ['MOON.M360ICT@GMAIL.COM'],
      phones: [
        {
          number: '01705511718',
          label: 'H',
        },
      ],
      identityDocuments: [
        {
          documentType: 'SECURE_FLIGHT_PASSENGER_DATA',
          givenName: 'MOON',
          surname: 'AHMED',
          birthDate: '2014-01-01',
          gender: 'MALE',
          itemId:
            '221e984a73396672128e308d42eac9acca1cbc4a289f2a7b8057017b574a9e0b8dee5b8308ca52af9431c24a6c194854c807e0bec3e993a5b558b41a377fc79f',
        },
      ],
    },
  ],
  flights: [
    {
      itemId: '12',
      confirmationId: 'SONRSV',
      sourceType: 'ATPCO',
      flightNumber: 437,
      airlineCode: 'BG',
      airlineName: 'BIMAN BANGLADESH',
      operatingFlightNumber: 437,
      operatingAirlineCode: 'BG',
      operatingAirlineName: 'BIMAN BANGLADESH',
      fromAirportCode: 'DAC',
      toAirportCode: 'CXB',
      departureDate: '2024-02-09',
      departureTime: '14:20:00',
      departureTerminalName: 'DOMESTIC TERMINAL',
      departureGate: 'D',
      arrivalDate: '2024-02-09',
      arrivalTime: '15:15:00',
      numberOfSeats: 2,
      cabinTypeName: 'ECONOMY',
      cabinTypeCode: 'Y',
      aircraftTypeCode: 'DH8',
      aircraftTypeName: 'DEHAVILLAND DASH 8',
      bookingClass: 'Y',
      meals: [
        {
          code: 'S',
          description: 'Snack',
        },
      ],
      flightStatusCode: 'HK',
      flightStatusName: 'Confirmed',
      durationInMinutes: 55,
      distanceInMiles: 189,
      travelerIndices: [1, 2],
      identityDocuments: [
        {
          itemId:
            'd25ad406e6b29492ff0eac297844a76880055a9c82fc89484d336fee016dd6d06db3a31cf93d1a18b0492b43a1a4d781f769c6196af6458943f3ef6931e75e94',
          status: 'Confirmed',
        },
        {
          itemId:
            '221e984a73396672128e308d42eac9acca1cbc4a289f2a7b8057017b574a9e0b8dee5b8308ca52af9431c24a6c194854c807e0bec3e993a5b558b41a377fc79f',
          status: 'Confirmed',
        },
      ],
    },
    {
      itemId: '13',
      confirmationId: 'SONRSV',
      sourceType: 'ATPCO',
      flightNumber: 438,
      airlineCode: 'BG',
      airlineName: 'BIMAN BANGLADESH',
      operatingFlightNumber: 438,
      operatingAirlineCode: 'BG',
      operatingAirlineName: 'BIMAN BANGLADESH',
      fromAirportCode: 'CXB',
      toAirportCode: 'DAC',
      departureDate: '2024-02-13',
      departureTime: '15:55:00',
      arrivalDate: '2024-02-13',
      arrivalTime: '16:50:00',
      arrivalTerminalName: 'DOMESTIC TERMINAL',
      arrivalGate: 'D',
      numberOfSeats: 2,
      cabinTypeName: 'ECONOMY',
      cabinTypeCode: 'Y',
      aircraftTypeCode: 'DH8',
      aircraftTypeName: 'DEHAVILLAND DASH 8',
      bookingClass: 'Y',
      meals: [
        {
          code: 'S',
          description: 'Snack',
        },
      ],
      flightStatusCode: 'HK',
      flightStatusName: 'Confirmed',
      durationInMinutes: 55,
      distanceInMiles: 189,
      travelerIndices: [1, 2],
      identityDocuments: [
        {
          itemId:
            'd25ad406e6b29492ff0eac297844a76880055a9c82fc89484d336fee016dd6d06db3a31cf93d1a18b0492b43a1a4d781f769c6196af6458943f3ef6931e75e94',
          status: 'Confirmed',
        },
        {
          itemId:
            '221e984a73396672128e308d42eac9acca1cbc4a289f2a7b8057017b574a9e0b8dee5b8308ca52af9431c24a6c194854c807e0bec3e993a5b558b41a377fc79f',
          status: 'Confirmed',
        },
      ],
    },
  ],
  journeys: [
    {
      firstAirportCode: 'DAC',
      departureDate: '2024-02-09',
      departureTime: '14:20',
      lastAirportCode: 'CXB',
      numberOfFlights: 1,
    },
    {
      firstAirportCode: 'CXB',
      departureDate: '2024-02-13',
      departureTime: '15:55',
      lastAirportCode: 'DAC',
      numberOfFlights: 1,
    },
  ],
  fareRules: [
    {
      originAirportCode: 'DAC',
      destinationAirportCode: 'DAC',
      owningAirlineCode: 'BG',
      passengerCode: 'ADT',
      isRefundable: true,
      refundPenalties: [
        {
          applicability: 'BEFORE_DEPARTURE',
          conditionsApply: false,
          penalty: {
            amount: '2000',
            currencyCode: 'BDT',
          },
        },
        {
          applicability: 'AFTER_DEPARTURE',
          conditionsApply: false,
          penalty: {
            amount: '2000',
            currencyCode: 'BDT',
          },
        },
      ],
      isChangeable: true,
      exchangePenalties: [
        {
          applicability: 'BEFORE_DEPARTURE',
          conditionsApply: false,
          penalty: {
            amount: '3000',
            currencyCode: 'BDT',
          },
        },
        {
          applicability: 'AFTER_DEPARTURE',
          conditionsApply: false,
          penalty: {
            amount: '3000',
            currencyCode: 'BDT',
          },
        },
      ],
    },
  ],
  fareOffers: [
    {
      travelerIndices: [1],
      flights: [
        {
          itemId: '12',
        },
      ],
      cabinBaggageAllowance: {
        maximumPieces: 1,
        totalWeightInKilograms: 7,
      },
      checkedBaggageAllowance: {
        totalWeightInKilograms: 20,
      },
      cabinBaggageCharges: [
        {
          maximumSizeInInches: 41,
          maximumSizeInCentimeters: 105,
          maximumWeightInPounds: 15,
          maximumWeightInKilograms: 7,
          numberOfPieces: 1,
          fee: {
            amount: '1000',
            currencyCode: 'BDT',
          },
        },
        {
          maximumSizeInInches: 41,
          maximumSizeInCentimeters: 105,
          maximumWeightInPounds: 15,
          maximumWeightInKilograms: 7,
          numberOfPieces: 1,
          fee: {
            amount: '100.00',
            currencyCode: 'USD',
          },
        },
      ],
      checkedBaggageCharges: [
        {
          maximumWeightInPounds: 50,
          maximumWeightInKilograms: 23,
          numberOfPieces: 1,
          specialItemDescription: 'PET IN HOLD UP TO 23KG',
          fee: {
            amount: '200.00',
            currencyCode: 'USD',
          },
        },
        {
          maximumWeightInPounds: 100,
          maximumWeightInKilograms: 45,
          numberOfPieces: 1,
          specialItemDescription: 'PET IN HOLD UP TO 45 KG',
          fee: {
            amount: '100.00',
            currencyCode: 'USD',
          },
        },
        {
          maximumWeightInPounds: 22,
          maximumWeightInKilograms: 10,
          numberOfPieces: 1,
          fee: {
            amount: '999',
            currencyCode: 'BDT',
          },
        },
        {
          maximumWeightInPounds: 100,
          maximumWeightInKilograms: 45,
          numberOfPieces: 1,
          specialItemDescription: 'MM STROLLER OR PUSCHAIR',
          fee: {
            amount: '1.00',
            currencyCode: 'USD',
          },
        },
      ],
    },
    {
      travelerIndices: [1],
      flights: [
        {
          itemId: '13',
        },
      ],
      cabinBaggageAllowance: {
        maximumPieces: 1,
        totalWeightInKilograms: 7,
      },
      checkedBaggageAllowance: {
        totalWeightInKilograms: 20,
      },
      cabinBaggageCharges: [
        {
          maximumSizeInInches: 41,
          maximumSizeInCentimeters: 105,
          maximumWeightInPounds: 15,
          maximumWeightInKilograms: 7,
          numberOfPieces: 1,
          fee: {
            amount: '1000',
            currencyCode: 'BDT',
          },
        },
        {
          maximumSizeInInches: 41,
          maximumSizeInCentimeters: 105,
          maximumWeightInPounds: 15,
          maximumWeightInKilograms: 7,
          numberOfPieces: 1,
          fee: {
            amount: '100.00',
            currencyCode: 'USD',
          },
        },
      ],
      checkedBaggageCharges: [
        {
          maximumWeightInPounds: 50,
          maximumWeightInKilograms: 23,
          numberOfPieces: 1,
          specialItemDescription: 'PET IN HOLD UP TO 23KG',
          fee: {
            amount: '200.00',
            currencyCode: 'USD',
          },
        },
        {
          maximumWeightInPounds: 100,
          maximumWeightInKilograms: 45,
          numberOfPieces: 1,
          specialItemDescription: 'PET IN HOLD UP TO 45 KG',
          fee: {
            amount: '100.00',
            currencyCode: 'USD',
          },
        },
        {
          maximumWeightInPounds: 22,
          maximumWeightInKilograms: 10,
          numberOfPieces: 1,
          fee: {
            amount: '999',
            currencyCode: 'BDT',
          },
        },
      ],
    },
  ],
  fares: [
    {
      creationDetails: {
        creationUserSine: 'AWS',
        creationDate: '2024-01-01',
        creationTime: '23:07',
        purchaseDeadlineDate: '2024-01-03',
        purchaseDeadlineTime: '23:59',
        userWorkPcc: 'N4PL',
        userHomePcc: 'N4PL',
      },
      airlineCode: 'BG',
      fareCalculationLine: 'DAC BG CXB8425BG DAC8425BDT16850END',
      isNegotiatedFare: false,
      travelerIndices: [1],
      fareConstruction: [
        {
          flights: [
            {
              itemId: '12',
            },
          ],
          flightIndices: [1],
          fareBasisCode: 'YDACFR',
          baseRate: {
            amount: '8425',
            currencyCode: 'BDT',
          },
          isCurrentItinerary: true,
          checkedBaggageAllowance: {
            totalWeightInKilograms: 20,
          },
        },
        {
          flights: [
            {
              itemId: '13',
            },
          ],
          flightIndices: [2],
          fareBasisCode: 'YDACFR',
          baseRate: {
            amount: '8425',
            currencyCode: 'BDT',
          },
          isCurrentItinerary: true,
          checkedBaggageAllowance: {
            totalWeightInKilograms: 20,
          },
        },
      ],
      taxBreakdown: [
        {
          taxCode: 'BD',
          taxAmount: {
            amount: '50',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'UT',
          taxAmount: {
            amount: '400',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'OW',
          taxAmount: {
            amount: '1000',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'E5',
          taxAmount: {
            amount: '60',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'YQ',
          taxAmount: {
            amount: '100',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'P8',
          taxAmount: {
            amount: '140',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'P7',
          taxAmount: {
            amount: '200',
            currencyCode: 'BDT',
          },
        },
      ],
      totals: {
        subtotal: '16850',
        taxes: '1950',
        total: '18800',
        currencyCode: 'BDT',
      },
      pricingTypeCode: 'S',
      pricingTypeName: 'System',
      pricingStatusCode: 'A',
      pricingStatusName: 'Active',
      requestedTravelerType: 'ADT',
      pricedTravelerType: 'ADT',
      recordTypeCode: 'PQ',
      recordTypeName: 'Price Quote',
      recordId: '1',
    },
    {
      creationDetails: {
        creationUserSine: 'AWS',
        creationDate: '2024-01-01',
        creationTime: '23:07',
        purchaseDeadlineDate: '2024-01-03',
        purchaseDeadlineTime: '23:59',
        userWorkPcc: 'N4PL',
        userHomePcc: 'N4PL',
      },
      airlineCode: 'BG',
      fareCalculationLine: 'DAC BG CXB6319BG DAC6319BDT12638END',
      isNegotiatedFare: false,
      travelerIndices: [2],
      fareConstruction: [
        {
          flights: [
            {
              itemId: '12',
            },
          ],
          flightIndices: [1],
          fareBasisCode: 'YDACFR/CH25',
          baseRate: {
            amount: '6319',
            currencyCode: 'BDT',
          },
          isCurrentItinerary: true,
          checkedBaggageAllowance: {
            totalWeightInKilograms: 20,
          },
        },
        {
          flights: [
            {
              itemId: '13',
            },
          ],
          flightIndices: [2],
          fareBasisCode: 'YDACFR/CH25',
          baseRate: {
            amount: '6319',
            currencyCode: 'BDT',
          },
          isCurrentItinerary: true,
          checkedBaggageAllowance: {
            totalWeightInKilograms: 20,
          },
        },
      ],
      taxBreakdown: [
        {
          taxCode: 'BD',
          taxAmount: {
            amount: '50',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'UT',
          taxAmount: {
            amount: '200',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'OW',
          taxAmount: {
            amount: '1000',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'E5',
          taxAmount: {
            amount: '60',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'YQ',
          taxAmount: {
            amount: '100',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'P8',
          taxAmount: {
            amount: '140',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'P7',
          taxAmount: {
            amount: '200',
            currencyCode: 'BDT',
          },
        },
      ],
      totals: {
        subtotal: '12638',
        taxes: '1750',
        total: '14388',
        currencyCode: 'BDT',
      },
      pricingTypeCode: 'S',
      pricingTypeName: 'System',
      pricingStatusCode: 'A',
      pricingStatusName: 'Active',
      requestedTravelerType: 'CNN',
      pricedTravelerType: 'CNN',
      recordTypeCode: 'PQ',
      recordTypeName: 'Price Quote',
      recordId: '2',
    },
  ],
  remarks: [
    {
      type: 'ITINERARY',
      text: 'THE FARE IS NOT GUARANTEED UNTIL THE TICKET HAS BEEN ISSUED.',
    },
    {
      type: 'ITINERARY',
      text: 'IF YOU DONT COMPLETE THE PAYMENT TRANSACTION WITH 30 MINUTES',
    },
    {
      type: 'ITINERARY',
      text: 'OF THE RESERVATION, YOUR BOOKING WILL BE CANCELED AUTOMATICALLY.',
    },
    {
      type: 'ITINERARY',
      text: 'YOUR TICKET IS NOT FULLY REFUNDABLE.',
    },
    {
      type: 'ITINERARY',
      text: 'PLEASE REPORT TO THE AIRPORT 4 HOURS PRIOR TO EACH DEPARTURE FLIGHT',
    },
    {
      type: 'ITINERARY',
      text: 'FOR TIME TO COMPLETE ALL FORMALITIES AND SECURITY CHECKS.',
    },
    {
      type: 'ITINERARY',
      text: 'FOR DATE CHANGE CHARGES WILL BE APPLICABLE.',
    },
    {
      type: 'ITINERARY',
      text: 'PLEASE RECONFIRM YOUR FLIGHT DETAILS 15 DAYS BEFORE OF DEPARTURE',
    },
    {
      type: 'GENERAL',
      text: 'XXTAW/',
    },
  ],
  allSegments: [
    {
      id: '12',
      type: 'FLIGHT',
      text: '437',
      vendorCode: 'BG',
      startDate: '2024-02-09',
      startTime: '14:20:00',
      startLocationCode: 'DAC',
      endDate: '2024-02-09',
      endTime: '15:15:00',
      endLocationCode: 'CXB',
    },
    {
      id: '13',
      type: 'FLIGHT',
      text: '438',
      vendorCode: 'BG',
      startDate: '2024-02-13',
      startTime: '15:55:00',
      startLocationCode: 'CXB',
      endDate: '2024-02-13',
      endTime: '16:50:00',
      endLocationCode: 'DAC',
    },
  ],
  flightTickets: [
    {
      number: '9972936069573',
      date: '2024-01-02',
      travelerIndex: 1,
      flightCoupons: [
        {
          itemId: '12',
          couponStatus: 'Not Flown',
          couponStatusCode: 'I',
        },
        {
          itemId: '13',
          couponStatus: 'Not Flown',
          couponStatusCode: 'I',
        },
      ],
      payment: {
        subtotal: '16850',
        taxes: '1950',
        total: '18800',
        currencyCode: 'BDT',
      },
      ticketStatusName: 'Issued',
      ticketStatusCode: 'TE',
      ticketingPcc: 'N4PL',
    },
    {
      number: '9972936069574',
      date: '2024-01-02',
      travelerIndex: 1,
      flightCoupons: [
        {
          itemId: '12',
          couponStatus: 'Not Flown',
          couponStatusCode: 'I',
        },
        {
          itemId: '13',
          couponStatus: 'Not Flown',
          couponStatusCode: 'I',
        },
      ],
      payment: {
        subtotal: '16850',
        taxes: '1950',
        total: '18800',
        currencyCode: 'BDT',
      },
      ticketStatusName: 'Issued',
      ticketStatusCode: 'TE',
      ticketingPcc: 'N4PL',
    },
  ],
  payments: {
    flightTotals: [
      {
        subtotal: '33700',
        taxes: '3900',
        total: '37600',
        currencyCode: 'BDT',
      },
    ],
    flightCurrentTotals: [
      {
        subtotal: '33700',
        taxes: '3900',
        total: '37600',
        currencyCode: 'BDT',
      },
    ],
  },
  otherServices: [
    {
      airlineCode: '1B',
      serviceMessage: 'PLEASE TICKET FARE AS PER TKT/TL IN PQ',
    },
    {
      airlineCode: '1B',
      serviceMessage: 'PLEASE TICKET FARE AS PER TKT/TL IN PQ',
    },
  ],
  specialServices: [
    {
      travelerIndices: [1],
      code: 'DOCS',
      name: 'API-Passenger Travel Document',
      message: '/DB/01JAN1990/M/AHMED/NAZMUL',
      statusCode: 'HK',
      statusName: 'Confirmed',
    },
    {
      travelerIndices: [2],
      code: 'DOCS',
      name: 'API-Passenger Travel Document',
      message: '/DB/01JAN2014/M/AHMED/MOON',
      statusCode: 'HK',
      statusName: 'Confirmed',
    },
    {
      travelerIndices: [1],
      flights: [
        {
          itemId: '13',
        },
      ],
      code: 'TKNE',
      message: '/9972936069574C2',
      statusCode: 'HK',
      statusName: 'Confirmed',
    },
    {
      travelerIndices: [1],
      flights: [
        {
          itemId: '12',
        },
      ],
      code: 'TKNE',
      message: '/9972936069574C1',
      statusCode: 'HK',
      statusName: 'Confirmed',
    },
    {
      travelerIndices: [1],
      flights: [
        {
          itemId: '13',
        },
      ],
      code: 'TKNE',
      message: '/9972936069573C2',
      statusCode: 'HK',
      statusName: 'Confirmed',
    },
    {
      travelerIndices: [1],
      flights: [
        {
          itemId: '12',
        },
      ],
      code: 'TKNE',
      message: '/9972936069573C1',
      statusCode: 'HK',
      statusName: 'Confirmed',
    },
  ],
  timestamp: '2024-01-02T05:09:23',
  bookingSignature:
    '5cfca8f9f1bb8d51f41778c920cc256159c197bc6cd27036468b626bd1f2e8dd5104976fece8557b1809e3bd7438dd0510e408a96e5a0d6c2ad762401ffcc578',
  request: {
    confirmationId: 'SQBSCN',
  },
};

export const pnrDetails2 = {
  bookingId: 'OZJQRH',
  startDate: '2024-06-20',
  endDate: '2024-06-20',
  isTicketed: true,
  creationDetails: {
    creationUserSine: 'AFS',
    creationDate: '2024-05-05',
    creationTime: '23:56',
    userWorkPcc: 'N4PL',
    userHomePcc: 'N4PL',
    primeHostId: '1B',
  },
  contactInfo: {
    phones: [' DAC'],
  },
  travelers: [
    {
      givenName: 'SHAHEB MR',
      surname: 'MOON',
      type: 'ADULT',
      passengerCode: 'ADT',
      nameAssociationId: '1',
      emails: ['NAZMUL.M360ICT@GMAIL.COM'],
      phones: [
        {
          number: '01705511718',
          label: 'H',
        },
      ],
      identityDocuments: [
        {
          documentNumber: 'BF0987623',
          documentType: 'PASSPORT',
          expiryDate: '2025-06-28',
          issuingCountryCode: 'BGD',
          residenceCountryCode: 'BGD',
          givenName: 'SHAHEB',
          surname: 'MOON',
          birthDate: '1982-06-23',
          gender: 'MALE',
          isPrimaryDocumentHolder: false,
          itemId:
            'c5c5823a2fef596edbe212b78e5ef179f85e023e0bd6704af15b660c04020cc7653684d6657310eb8006804dcbd622fea3aa4db828e46846a442f5f8e4f18542',
        },
      ],
    },
  ],
  flights: [
    {
      itemId: '26',
      confirmationId: 'ODPAXO',
      sourceType: 'ATPCO',
      flightNumber: 371,
      airlineCode: 'BG',
      airlineName: 'BIMAN BANGLADESH',
      operatingFlightNumber: 371,
      operatingAirlineCode: 'BG',
      operatingAirlineName: 'BIMAN BANGLADESH',
      fromAirportCode: 'DAC',
      toAirportCode: 'KTM',
      departureDate: '2024-06-20',
      departureTime: '10:15:00',
      departureTerminalName: 'TERMINAL 2',
      departureGate: '2',
      arrivalDate: '2024-06-20',
      arrivalTime: '11:35:00',
      arrivalTerminalName: 'TERMINAL I - INTERNATIONAL',
      arrivalGate: 'I',
      numberOfSeats: 1,
      cabinTypeName: 'ECONOMY',
      cabinTypeCode: 'Y',
      aircraftTypeCode: '738',
      aircraftTypeName: 'BOEING 737-800',
      bookingClass: 'K',
      meals: [
        {
          code: 'S',
          description: 'Snack',
        },
      ],
      flightStatusCode: 'HK',
      flightStatusName: 'Confirmed',
      durationInMinutes: 95,
      distanceInMiles: 413,
      travelerIndices: [1],
      identityDocuments: [
        {
          itemId:
            'c5c5823a2fef596edbe212b78e5ef179f85e023e0bd6704af15b660c04020cc7653684d6657310eb8006804dcbd622fea3aa4db828e46846a442f5f8e4f18542',
          status: 'Confirmed',
        },
      ],
    },
  ],
  journeys: [
    {
      firstAirportCode: 'DAC',
      departureDate: '2024-06-20',
      departureTime: '10:15',
      lastAirportCode: 'KTM',
      numberOfFlights: 1,
    },
  ],
  fareRules: [
    {
      originAirportCode: 'DAC',
      destinationAirportCode: 'KTM',
      owningAirlineCode: 'BG',
      passengerCode: 'ADT',
      isRefundable: true,
      refundPenalties: [
        {
          applicability: 'BEFORE_DEPARTURE',
          conditionsApply: false,
          penalty: {
            amount: '3850',
            currencyCode: 'BDT',
          },
        },
      ],
      isChangeable: true,
      exchangePenalties: [
        {
          applicability: 'BEFORE_DEPARTURE',
          conditionsApply: false,
          penalty: {
            amount: '2200',
            currencyCode: 'BDT',
          },
        },
      ],
    },
  ],
  fareOffers: [
    {
      travelerIndices: [1],
      flights: [
        {
          itemId: '26',
        },
      ],
      cabinBaggageAllowance: {
        maximumPieces: 1,
        totalWeightInKilograms: 7,
      },
      checkedBaggageAllowance: {
        totalWeightInKilograms: 20,
      },
      cabinBaggageCharges: [
        {
          maximumSizeInInches: 41,
          maximumSizeInCentimeters: 105,
          maximumWeightInPounds: 15,
          maximumWeightInKilograms: 7,
          numberOfPieces: 1,
          fee: {
            amount: '100.00',
            currencyCode: 'USD',
          },
        },
      ],
      checkedBaggageCharges: [
        {
          maximumWeightInPounds: 100,
          maximumWeightInKilograms: 45,
          numberOfPieces: 1,
          specialItemDescription: 'PET IN HOLD UP TO 45 KG',
          fee: {
            amount: '300.00',
            currencyCode: 'USD',
          },
        },
      ],
    },
  ],
  fares: [
    {
      creationDetails: {
        creationUserSine: 'AFS',
        creationDate: '2024-05-06',
        creationTime: '04:27',
        purchaseDeadlineDate: '2024-05-09',
        purchaseDeadlineTime: '23:59',
        userWorkPcc: 'N4PL',
        userHomePcc: 'N4PL',
      },
      airlineCode: 'BG',
      fareCalculationLine: 'DAC BG KTM165.00NUC165.00END ROE1.00',
      isNegotiatedFare: false,
      fareConstruction: [
        {
          fareBasisCode: 'KBDO',
          baseRate: {
            amount: '165.00',
            currencyCode: 'NUC',
          },
          isCurrentItinerary: true,
          checkedBaggageAllowance: {
            totalWeightInKilograms: 20,
          },
        },
      ],
      taxBreakdown: [
        {
          taxCode: 'BD',
          taxAmount: {
            amount: '500',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'UT',
          taxAmount: {
            amount: '2000',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'OW',
          taxAmount: {
            amount: '500',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'E5',
          taxAmount: {
            amount: '257',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'P8',
          taxAmount: {
            amount: '660',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'P7',
          taxAmount: {
            amount: '550',
            currencyCode: 'BDT',
          },
        },
      ],
      totals: {
        subtotal: '18150',
        taxes: '4467',
        total: '22617',
        currencyCode: 'BDT',
      },
      pricingTypeCode: 'S',
      pricingTypeName: 'System',
      pricingStatusCode: 'A',
      pricingStatusName: 'Active',
      requestedTravelerType: 'ADT',
      pricedTravelerType: 'ADT',
      recordTypeCode: 'PQ',
      recordTypeName: 'Price Quote',
      recordId: '1',
    },
  ],
  remarks: [
    {
      type: 'GENERAL',
      text: 'XXTAW/',
    },
  ],
  allSegments: [
    {
      id: '26',
      type: 'FLIGHT',
      text: '371',
      vendorCode: 'BG',
      startDate: '2024-06-20',
      startTime: '10:15:00',
      startLocationCode: 'DAC',
      endDate: '2024-06-20',
      endTime: '11:35:00',
      endLocationCode: 'KTM',
    },
  ],
  flightTickets: [
    {
      number: '9976661716847',
      date: '2024-05-06',
      agencyIataNumber: '42343862',
      travelerIndex: 1,
      flightCoupons: [
        {
          itemId: '26',
          couponStatus: 'Not Flown',
          couponStatusCode: 'I',
        },
      ],
      payment: {
        subtotal: '18150',
        taxes: '4467',
        total: '22617',
        currencyCode: 'BDT',
      },
      ticketStatusName: 'Issued',
      ticketStatusCode: 'TE',
      ticketingPcc: 'N4PL',
      commission: {
        commissionAmount: '1271',
        currencyCode: 'BDT',
        commissionPercentage: '7.00',
      },
    },
  ],
  payments: {
    flightTotals: [
      {
        subtotal: '18150',
        taxes: '4467',
        total: '22617',
        currencyCode: 'BDT',
      },
    ],
    flightCurrentTotals: [
      {
        subtotal: '18150',
        taxes: '4467',
        total: '22617',
        currencyCode: 'BDT',
      },
    ],
  },
  otherServices: [
    {
      airlineCode: '1B',
      serviceMessage: 'PLEASE TICKET FARE AS PER TKT/TL IN PQ',
    },
    {
      airlineCode: '1B',
      serviceMessage: 'PLEASE TICKET FARE AS PER TKT/TL IN PQ',
    },
  ],
  specialServices: [
    {
      code: 'ADTK',
      message: 'BS // TTL FOR AUTO CANX FIXED FOR 08MAY24 AT 0918 GMT',
    },
    {
      code: 'ADTK',
      message: 'BS // TTL FOR AUTO CANX FIXED FOR 08MAY24 AT 0457 GMT',
    },
    {
      travelerIndices: [1],
      code: 'CTCE',
      name: 'Passenger contact information e-mail address',
      message: '/FAHIM19RATUL//GMAIL.COM',
      statusCode: 'HK',
      statusName: 'Confirmed',
    },
    {
      travelerIndices: [1],
      code: 'CTCM',
      name: 'Passenger contact information mobile phone number',
      message: '/01888798798',
      statusCode: 'HK',
      statusName: 'Confirmed',
    },
    {
      travelerIndices: [1],
      code: 'DOCS',
      name: 'API-Passenger Travel Document',
      message: '/P/BGD/BF0987623/BGD/23JUN82/M/28JUN25/MOON/SHAHEB',
      statusCode: 'HK',
      statusName: 'Confirmed',
    },
    {
      travelerIndices: [1],
      flights: [
        {
          itemId: '26',
        },
      ],
      code: 'TKNE',
      message: '/9976661716847C1',
      statusCode: 'HK',
      statusName: 'Confirmed',
    },
  ],
  accountingItems: [
    {
      fareApplicationType: 'Single Traveler',
      formOfPaymentType: 'Cash',
      airlineCode: 'BG',
      ticketNumber: '9976661716847',
      commission: {
        commissionAmount: '1271',
      },
      fareAmount: '18150',
      taxAmount: '4467',
      travelerIndices: [1],
      tariffBasisType: 'Foreign',
    },
  ],
  timestamp: '2024-05-06T11:27:50',
  bookingSignature:
    'c3c45c6d05d9acd4c681bbdcf97ff04b3ebcd1030a7eec739308539667106315b1cf70d738ea31ce05da24ae5cfc595ade2a1695917019aa388800e28475ec88',
  request: {
    confirmationId: 'OZJQRH',
  },
};
