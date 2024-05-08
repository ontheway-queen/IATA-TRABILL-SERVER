export const pnrDetails3 = {
  bookingId: 'SYUSWR',
  startDate: '2024-06-20',
  endDate: '2024-06-26',
  isTicketed: true,
  creationDetails: {
    creationUserSine: 'AFS',
    creationDate: '2024-05-08',
    creationTime: '00:47',
    userWorkPcc: 'N4PL',
    userHomePcc: 'N4PL',
    primeHostId: '1B',
  },
  contactInfo: {
    phones: [' DAC'],
  },
  travelers: [
    {
      givenName: 'NAMZUL MR',
      surname: 'KING',
      type: 'ADULT',
      passengerCode: 'ADT',
      nameAssociationId: '1',
      identityDocuments: [
        {
          documentNumber: 'BF09876234',
          documentType: 'PASSPORT',
          expiryDate: '2024-06-28',
          issuingCountryCode: 'BGD',
          residenceCountryCode: 'BGD',
          givenName: 'NAMZUL',
          surname: 'KING',
          birthDate: '1992-06-23',
          gender: 'MALE',
          isPrimaryDocumentHolder: false,
          itemId:
            '01b6d8c1041a9f89f5d67884c069d95221e4ee44b9ba0fe955ddde916510bc8f8423adaf523d97281ff3cb9dd1c6a1e77c14e679f2163b61d528b80ecfa35218',
        },
      ],
    },
  ],
  flights: [
    {
      itemId: '12',
      confirmationId: 'TANZWC',
      sourceType: 'ATPCO',
      flightNumber: 147,
      airlineCode: 'BG',
      airlineName: 'BIMAN BANGLADESH',
      operatingFlightNumber: 147,
      operatingAirlineCode: 'BG',
      operatingAirlineName: 'BIMAN BANGLADESH',
      fromAirportCode: 'DAC',
      toAirportCode: 'DXB',
      departureDate: '2024-06-20',
      departureTime: '17:25:00',
      arrivalDate: '2024-06-20',
      arrivalTime: '22:15:00',
      numberOfSeats: 1,
      cabinTypeName: 'ECONOMY',
      cabinTypeCode: 'Y',
      aircraftTypeCode: '788',
      aircraftTypeName: 'BOEING 787-8',
      bookingClass: 'K',
      meals: [
        {
          code: 'M',
          description: 'Meal',
        },
      ],
      flightStatusCode: 'HK',
      flightStatusName: 'Confirmed',
      durationInMinutes: 350,
      distanceInMiles: 2451,
      hiddenStopAirportCode: 'CGP',
      hiddenStopArrivalDate: '2024-06-20',
      hiddenStopArrivalTime: '18:10',
      hiddenStopDepartureDate: '2024-06-20',
      hiddenStopDepartureTime: '19:10',
      hiddenStops: [
        {
          airportCode: 'CGP',
          departureDate: '2024-06-20',
          departureTime: '19:10',
          arrivalDate: '2024-06-20',
          arrivalTime: '18:10',
          durationInMinutes: 60,
        },
      ],
      travelerIndices: [1],
      identityDocuments: [
        {
          itemId:
            '01b6d8c1041a9f89f5d67884c069d95221e4ee44b9ba0fe955ddde916510bc8f8423adaf523d97281ff3cb9dd1c6a1e77c14e679f2163b61d528b80ecfa35218',
          status: 'Confirmed',
        },
      ],
    },
    {
      itemId: '13',
      confirmationId: 'TANZWC',
      sourceType: 'ATPCO',
      flightNumber: 348,
      airlineCode: 'BG',
      airlineName: 'BIMAN BANGLADESH',
      operatingFlightNumber: 348,
      operatingAirlineCode: 'BG',
      operatingAirlineName: 'BIMAN BANGLADESH',
      fromAirportCode: 'DXB',
      toAirportCode: 'DAC',
      departureDate: '2024-06-26',
      departureTime: '00:05:00',
      departureTerminalName: 'TERMINAL 1',
      departureGate: '1',
      arrivalDate: '2024-06-26',
      arrivalTime: '06:55:00',
      arrivalTerminalName: 'TERMINAL 2',
      arrivalGate: '2',
      numberOfSeats: 1,
      cabinTypeName: 'ECONOMY',
      cabinTypeCode: 'Y',
      aircraftTypeCode: '788',
      aircraftTypeName: 'BOEING 787-8',
      bookingClass: 'K',
      meals: [
        {
          code: 'M',
          description: 'Meal',
        },
      ],
      flightStatusCode: 'HK',
      flightStatusName: 'Confirmed',
      durationInMinutes: 290,
      distanceInMiles: 2202,
      travelerIndices: [1],
      identityDocuments: [
        {
          itemId:
            '01b6d8c1041a9f89f5d67884c069d95221e4ee44b9ba0fe955ddde916510bc8f8423adaf523d97281ff3cb9dd1c6a1e77c14e679f2163b61d528b80ecfa35218',
          status: 'Confirmed',
        },
      ],
    },
  ],
  journeys: [
    {
      firstAirportCode: 'DAC',
      departureDate: '2024-06-20',
      departureTime: '17:25',
      lastAirportCode: 'DXB',
      numberOfFlights: 1,
    },
    {
      firstAirportCode: 'DXB',
      departureDate: '2024-06-26',
      departureTime: '00:05',
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
            amount: '15400',
            currencyCode: 'BDT',
          },
        },
        {
          applicability: 'AFTER_DEPARTURE',
          conditionsApply: false,
          penalty: {
            amount: '15400',
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
            amount: '11000',
            currencyCode: 'BDT',
          },
        },
        {
          applicability: 'AFTER_DEPARTURE',
          conditionsApply: false,
          penalty: {
            amount: '11000',
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
        totalWeightInKilograms: 30,
      },
      cabinBaggageCharges: [
        {
          maximumSizeInInches: 41,
          maximumSizeInCentimeters: 105,
          maximumWeightInPounds: 15,
          maximumWeightInKilograms: 7,
          numberOfPieces: 1,
          fee: {
            amount: '50.00',
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
        {
          maximumWeightInPounds: 50,
          maximumWeightInKilograms: 23,
          numberOfPieces: 1,
          fee: {
            amount: '450.00',
            currencyCode: 'USD',
          },
        },
        {
          maximumSizeInInches: 80,
          maximumSizeInCentimeters: 203,
          numberOfPieces: 1,
          fee: {
            amount: '50.00',
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
        totalWeightInKilograms: 50,
      },
      cabinBaggageCharges: [
        {
          maximumSizeInInches: 41,
          maximumSizeInCentimeters: 105,
          maximumWeightInPounds: 15,
          maximumWeightInKilograms: 7,
          numberOfPieces: 1,
          fee: {
            amount: '50.00',
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
        {
          maximumWeightInPounds: 22,
          maximumWeightInKilograms: 10,
          numberOfPieces: 1,
          fee: {
            amount: '250',
            currencyCode: 'AED',
          },
        },
        {
          maximumSizeInInches: 62,
          maximumSizeInCentimeters: 158,
          maximumWeightInPounds: 44,
          maximumWeightInKilograms: 20,
          numberOfPieces: 1,
          fee: {
            amount: '400',
            currencyCode: 'AED',
          },
        },
        {
          maximumSizeInInches: 80,
          maximumSizeInCentimeters: 203,
          numberOfPieces: 1,
          fee: {
            amount: '50.00',
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
        creationDate: '2024-05-08',
        creationTime: '00:48',
        purchaseDeadlineDate: '2024-05-12',
        purchaseDeadlineTime: '23:59',
        userWorkPcc: 'N4PL',
        userHomePcc: 'N4PL',
      },
      airlineCode: 'BG',
      fareCalculationLine: 'DAC BG DXB235.00BG DAC235.00NUC470.00END ROE1.00',
      isNegotiatedFare: false,
      fareConstruction: [
        {
          flights: [
            {
              itemId: '12',
            },
          ],
          flightIndices: [1],
          fareBasisCode: 'KSALBD6M',
          baseRate: {
            amount: '235.00',
            currencyCode: 'NUC',
          },
          isCurrentItinerary: true,
          checkedBaggageAllowance: {
            totalWeightInKilograms: 30,
          },
        },
        {
          flights: [
            {
              itemId: '13',
            },
          ],
          flightIndices: [2],
          fareBasisCode: 'KSALBD6M',
          baseRate: {
            amount: '235.00',
            currencyCode: 'NUC',
          },
          isCurrentItinerary: true,
          checkedBaggageAllowance: {
            totalWeightInKilograms: 50,
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
            amount: '4000',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'OW',
          taxAmount: {
            amount: '2000',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'E5',
          taxAmount: {
            amount: '405',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'AE',
          taxAmount: {
            amount: '2247',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'TP',
          taxAmount: {
            amount: '150',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'ZR',
          taxAmount: {
            amount: '300',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'F6',
          taxAmount: {
            amount: '1199',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'P8',
          taxAmount: {
            amount: '1100',
            currencyCode: 'BDT',
          },
        },
        {
          taxCode: 'P7',
          taxAmount: {
            amount: '1100',
            currencyCode: 'BDT',
          },
        },
      ],
      totals: {
        subtotal: '51700',
        taxes: '13001',
        total: '64701',
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
      id: '12',
      type: 'FLIGHT',
      text: '147',
      vendorCode: 'BG',
      startDate: '2024-06-20',
      startTime: '17:25:00',
      startLocationCode: 'DAC',
      endDate: '2024-06-20',
      endTime: '22:15:00',
      endLocationCode: 'DXB',
    },
    {
      id: '13',
      type: 'FLIGHT',
      text: '348',
      vendorCode: 'BG',
      startDate: '2024-06-26',
      startTime: '00:05:00',
      startLocationCode: 'DXB',
      endDate: '2024-06-26',
      endTime: '06:55:00',
      endLocationCode: 'DAC',
    },
  ],
  flightTickets: [
    {
      number: '9976661716848',
      date: '2024-05-08',
      agencyIataNumber: '42343862',
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
        subtotal: '51700',
        taxes: '13001',
        total: '64701',
        currencyCode: 'BDT',
      },
      ticketStatusName: 'Issued',
      ticketStatusCode: 'TE',
      ticketingPcc: 'N4PL',
      commission: {
        commissionAmount: '3619',
        currencyCode: 'BDT',
        commissionPercentage: '7.00',
      },
    },
  ],
  payments: {
    flightTotals: [
      {
        subtotal: '51700',
        taxes: '13001',
        total: '64701',
        currencyCode: 'BDT',
      },
    ],
    flightCurrentTotals: [
      {
        subtotal: '51700',
        taxes: '13001',
        total: '64701',
        currencyCode: 'BDT',
      },
    ],
  },
  otherServices: [
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
      message: '/P/BGD/BF09876234/BGD/23JUN92/M/28JUN24/KING/NAMZUL',
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
      message: '/9976661716848C2',
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
      message: '/9976661716848C1',
      statusCode: 'HK',
      statusName: 'Confirmed',
    },
  ],
  accountingItems: [
    {
      fareApplicationType: 'Single Traveler',
      formOfPaymentType: 'Cash',
      airlineCode: 'BG',
      ticketNumber: '9976661716848',
      commission: {
        commissionAmount: '3619',
      },
      fareAmount: '51700',
      taxAmount: '13001',
      travelerIndices: [1],
      tariffBasisType: 'Foreign',
    },
  ],
  timestamp: '2024-05-08T05:52:20',
  bookingSignature:
    '74f2cb666e883f21ab28c093dfbf59d6676faf09064b92fa832e980caf86fa8ca15eba47fa794f0817acb025f0d0775d797d25f4e0d4121ee77fb2db693e1887',
  request: {
    confirmationId: 'SYUSWR',
  },
};
