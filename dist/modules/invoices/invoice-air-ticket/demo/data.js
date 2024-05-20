"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voidPnrData = exports.pnrDetails3 = void 0;
exports.pnrDetails3 = {
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
                    itemId: '01b6d8c1041a9f89f5d67884c069d95221e4ee44b9ba0fe955ddde916510bc8f8423adaf523d97281ff3cb9dd1c6a1e77c14e679f2163b61d528b80ecfa35218',
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
                    itemId: '01b6d8c1041a9f89f5d67884c069d95221e4ee44b9ba0fe955ddde916510bc8f8423adaf523d97281ff3cb9dd1c6a1e77c14e679f2163b61d528b80ecfa35218',
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
                    itemId: '01b6d8c1041a9f89f5d67884c069d95221e4ee44b9ba0fe955ddde916510bc8f8423adaf523d97281ff3cb9dd1c6a1e77c14e679f2163b61d528b80ecfa35218',
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
    bookingSignature: '74f2cb666e883f21ab28c093dfbf59d6676faf09064b92fa832e980caf86fa8ca15eba47fa794f0817acb025f0d0775d797d25f4e0d4121ee77fb2db693e1887',
    request: {
        confirmationId: 'SYUSWR',
    },
};
exports.voidPnrData = {
    bookingId: 'AGVKZZ',
    isTicketed: true,
    creationDetails: {
        creationUserSine: 'AHN',
        creationDate: '2024-04-30',
        creationTime: '05:57',
        userWorkPcc: 'N4PL',
        userHomePcc: 'N4PL',
        primeHostId: '1B',
    },
    contactInfo: {
        emails: ['ALNAYEEM.T360@GMAIL.COM'],
        phones: [' DAC T360 TOURS AND TRAVELS CTC 01888798798 REF NAYEEM'],
    },
    travelers: [
        {
            givenName: 'RAHAT REZA MR',
            surname: 'CHOWDHURY',
            type: 'ADULT',
            passengerCode: 'ADT',
            nameAssociationId: '1',
            identityDocuments: [
                {
                    documentNumber: '546285034',
                    documentType: 'PASSPORT',
                    expiryDate: '2026-09-14',
                    issuingCountryCode: 'USA',
                    residenceCountryCode: 'USA',
                    givenName: 'RAHAT REZA',
                    surname: 'CHOWDHURY',
                    birthDate: '1967-01-01',
                    gender: 'MALE',
                    isPrimaryDocumentHolder: false,
                    itemId: '3f4b67386d1bb7ace84fbf298758e71cb19808cb26aa6378b02fddd61f4a3c80f6ff1388c840699de96c5040eceddbc660b91ce0eb868e710153fc86e5808c4e',
                },
            ],
        },
        {
            givenName: 'FARID AHMED MR',
            surname: 'CHOUDHURY',
            type: 'ADULT',
            passengerCode: 'ADT',
            nameAssociationId: '2',
            identityDocuments: [
                {
                    documentNumber: 'EG0017909',
                    documentType: 'PASSPORT',
                    expiryDate: '2025-06-07',
                    issuingCountryCode: 'BGD',
                    residenceCountryCode: 'BGD',
                    givenName: 'FARID AHMED',
                    surname: 'CHOUDHURY',
                    birthDate: '1940-03-01',
                    gender: 'MALE',
                    isPrimaryDocumentHolder: false,
                    itemId: 'd9a46d2a97483d7b7ecb33f46dabefbc8efc1c0ac037d40a298ec05ec2808eece69ac2dcaf26d19dc31a3d46ce9d0d34964e56cb98c71705826e1543e2e0577d',
                },
            ],
        },
        {
            givenName: 'HOSNE ARA MRS',
            surname: 'BEGUM',
            type: 'ADULT',
            passengerCode: 'ADT',
            nameAssociationId: '3',
            identityDocuments: [
                {
                    documentNumber: 'EG0007757',
                    documentType: 'PASSPORT',
                    expiryDate: '2025-06-06',
                    issuingCountryCode: 'BGD',
                    residenceCountryCode: 'BGD',
                    givenName: 'HOSNE ARA',
                    surname: 'BEGUM',
                    birthDate: '1945-12-31',
                    gender: 'FEMALE',
                    isPrimaryDocumentHolder: false,
                    itemId: '49eb7e349db3b245e4fb8d35c878ff77da62b9f2b7751efb23b95e4bdc977033b094e421060d730003981c6d46636b16e136c1aa482b1ac278cd289fb68f798f',
                },
            ],
        },
    ],
    fares: [
        {
            creationDetails: {
                creationUserSine: 'AFH',
                creationDate: '2024-04-30',
                creationTime: '06:15',
                userWorkPcc: 'N4PL',
                userHomePcc: 'N4PL',
            },
            airlineCode: 'MH',
            fareCalculationLine: 'DAC MH X/KUL MH SYD448.50MH X/KUL MH DAC448.50NUC897.00END ROE1.00',
            isNegotiatedFare: false,
            fareConstruction: [
                {
                    fareBasisCode: 'QBX1YBD',
                    baseRate: {
                        amount: '448.50',
                        currencyCode: 'NUC',
                    },
                    brandFareCode: 'BASIC',
                    brandFareName: 'BASIC',
                    brandProgramCode: 'CFFMH',
                    brandProgramName: 'MHPUBLIC',
                    isCurrentItinerary: false,
                    checkedBaggageAllowance: {
                        totalWeightInKilograms: 20,
                    },
                },
                {
                    fareBasisCode: 'QBX1YBD',
                    baseRate: {
                        amount: '448.50',
                        currencyCode: 'NUC',
                    },
                    brandFareCode: 'BASIC',
                    brandFareName: 'BASIC',
                    brandProgramCode: 'CFFMH',
                    brandProgramName: 'MHPUBLIC',
                    isCurrentItinerary: false,
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
                        amount: '6000',
                        currencyCode: 'BDT',
                    },
                },
                {
                    taxCode: 'OW',
                    taxAmount: {
                        amount: '3000',
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
                    taxCode: 'AU',
                    taxAmount: {
                        amount: '5032',
                        currencyCode: 'BDT',
                    },
                },
                {
                    taxCode: 'WG',
                    taxAmount: {
                        amount: '600',
                        currencyCode: 'BDT',
                    },
                },
                {
                    taxCode: 'WY',
                    taxAmount: {
                        amount: '4756',
                        currencyCode: 'BDT',
                    },
                },
                {
                    taxCode: 'YQ',
                    taxAmount: {
                        amount: '5500',
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
                subtotal: '98670',
                taxes: '27993',
                total: '126663',
                currencyCode: 'BDT',
            },
            pricingTypeCode: 'S',
            pricingTypeName: 'System',
            pricingStatusCode: 'A',
            pricingStatusName: 'Active',
            hasValidPricing: false,
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
    flightTickets: [
        {
            number: '2326652022078',
            date: '2024-04-30',
            agencyIataNumber: '42343862',
            travelerIndex: 1,
            allCoupons: [
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
            ],
            payment: {
                subtotal: '98670',
                taxes: '27993',
                total: '126663',
                currencyCode: 'BDT',
            },
            ticketStatusName: 'Voided',
            ticketStatusCode: 'TV',
            ticketingPcc: 'N4PL',
            commission: {
                commissionAmount: '6907',
                currencyCode: 'BDT',
            },
        },
        {
            number: '2326652022079',
            date: '2024-04-30',
            agencyIataNumber: '42343862',
            travelerIndex: 2,
            allCoupons: [
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
            ],
            payment: {
                subtotal: '98670',
                taxes: '27993',
                total: '126663',
                currencyCode: 'BDT',
            },
            ticketStatusName: 'Voided',
            ticketStatusCode: 'TV',
            ticketingPcc: 'N4PL',
            commission: {
                commissionAmount: '6907',
                currencyCode: 'BDT',
            },
        },
        {
            number: '2326652022080',
            date: '2024-04-30',
            agencyIataNumber: '42343862',
            travelerIndex: 3,
            allCoupons: [
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
            ],
            payment: {
                subtotal: '98670',
                taxes: '27993',
                total: '126663',
                currencyCode: 'BDT',
            },
            ticketStatusName: 'Voided',
            ticketStatusCode: 'TV',
            ticketingPcc: 'N4PL',
            commission: {
                commissionAmount: '6907',
                currencyCode: 'BDT',
            },
        },
        {
            number: '2321809773811',
            date: '2024-04-30',
            agencyIataNumber: '42343862',
            travelerIndex: 1,
            allCoupons: [
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
            ],
            payment: {
                subtotal: '20318',
                taxes: '0',
                total: '20318',
                currencyCode: 'BDT',
            },
            ticketStatusName: 'Voided',
            ticketStatusCode: 'MV',
            ticketingPcc: 'N4PL',
        },
        {
            number: '2321809773812',
            date: '2024-04-30',
            agencyIataNumber: '42343862',
            travelerIndex: 2,
            allCoupons: [
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
            ],
            payment: {
                subtotal: '20318',
                taxes: '0',
                total: '20318',
                currencyCode: 'BDT',
            },
            ticketStatusName: 'Voided',
            ticketStatusCode: 'MV',
            ticketingPcc: 'N4PL',
        },
        {
            number: '2321809773813',
            date: '2024-04-30',
            agencyIataNumber: '42343862',
            travelerIndex: 3,
            allCoupons: [
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
                {
                    couponStatus: 'Voided',
                    couponStatusCode: 'V',
                },
            ],
            payment: {
                subtotal: '20318',
                taxes: '0',
                total: '20318',
                currencyCode: 'BDT',
            },
            ticketStatusName: 'Voided',
            ticketStatusCode: 'MV',
            ticketingPcc: 'N4PL',
        },
    ],
    payments: {
        flightTotals: [
            {
                subtotal: '356964',
                taxes: '83979',
                total: '440943',
                currencyCode: 'BDT',
            },
        ],
    },
    specialServices: [
        {
            code: 'ADMD',
            message: 'TO MH BY 01MAY 1719 OTHERWISE WILL BE CANCELLED',
            statusCode: 'KK',
            statusName: 'Confirmed',
        },
        {
            code: 'ADTK',
            message: 'TO MH BY 14MAY 0800 ZZZ TIME ZONE OTHERWISE WILL BE XLD',
        },
        {
            travelerIndices: [1],
            code: 'CTCE',
            name: 'Passenger contact information e-mail address',
            message: '/RESERVATION.T360//GMAIL.COM',
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
            message: '/P/USA/546285034/USA/01JAN67/M/14SEP26/CHOWDHURY/RAHAT REZA',
            statusCode: 'HK',
            statusName: 'Confirmed',
        },
        {
            travelerIndices: [3],
            code: 'DOCS',
            name: 'API-Passenger Travel Document',
            message: '/P/BGD/EG0007757/BGD/31DEC45/F/06JUN25/BEGUM/HOSNE ARA',
            statusCode: 'HK',
            statusName: 'Confirmed',
        },
        {
            travelerIndices: [2],
            code: 'DOCS',
            name: 'API-Passenger Travel Document',
            message: '/P/BGD/EG0017909/BGD/01MAR40/M/07JUN25/CHOUDHURY/FARID AHMED',
            statusCode: 'HK',
            statusName: 'Confirmed',
        },
        {
            code: 'OTHS',
            message: 'MISSING SSR CTCM MOBILE OR SSR CTCE EMAIL OR SSR CTCR NON-CONSENT FOR MH',
        },
    ],
    accountingItems: [
        {
            fareApplicationType: 'Single Traveler',
            formOfPaymentType: 'Cash',
            airlineCode: 'MH',
            ticketNumber: '2326652022078',
            commission: {
                commissionAmount: '6907',
            },
            fareAmount: '98670',
            taxAmount: '27993',
            travelerIndices: [1],
            tariffBasisType: 'Foreign',
        },
        {
            fareApplicationType: 'Single Traveler',
            formOfPaymentType: 'Cash',
            airlineCode: 'MH',
            ticketNumber: '2326652022079',
            commission: {
                commissionAmount: '6907',
            },
            fareAmount: '98670',
            taxAmount: '27993',
            travelerIndices: [2],
            tariffBasisType: 'Foreign',
        },
        {
            fareApplicationType: 'Single Traveler',
            formOfPaymentType: 'Cash',
            airlineCode: 'MH',
            ticketNumber: '2326652022080',
            commission: {
                commissionAmount: '6907',
            },
            fareAmount: '98670',
            taxAmount: '27993',
            travelerIndices: [3],
            tariffBasisType: 'Foreign',
        },
        {
            fareApplicationType: 'Single Traveler',
            formOfPaymentType: 'Cash',
            airlineCode: 'MH',
            ticketNumber: '2321809773811',
            commission: {
                commissionAmount: '0',
            },
            fareAmount: '20318',
            taxAmount: '0',
            travelerIndices: [1],
            tariffBasisType: 'International',
        },
        {
            fareApplicationType: 'Single Traveler',
            formOfPaymentType: 'Cash',
            airlineCode: 'MH',
            ticketNumber: '2321809773812',
            commission: {
                commissionAmount: '0',
            },
            fareAmount: '20318',
            taxAmount: '0',
            travelerIndices: [2],
            tariffBasisType: 'International',
        },
        {
            fareApplicationType: 'Single Traveler',
            formOfPaymentType: 'Cash',
            airlineCode: 'MH',
            ticketNumber: '2321809773813',
            commission: {
                commissionAmount: '0',
            },
            fareAmount: '20318',
            taxAmount: '0',
            travelerIndices: [3],
            tariffBasisType: 'International',
        },
    ],
    timestamp: '2024-05-14T11:47:18',
    bookingSignature: 'a9c595dba580abdd0da247687f27315524e8cdf13848622dab9358564b5282e377297278e458f75df35854b0f58b6b8f68f3c0fef6c381a25867689ab1bad544',
    request: {
        confirmationId: 'AGVKZZ',
    },
};
//# sourceMappingURL=data.js.map