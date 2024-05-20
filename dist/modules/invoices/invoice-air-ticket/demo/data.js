"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticPnrData = void 0;
exports.staticPnrData = {
    bookingId: 'TWYODI',
    startDate: '2024-07-20',
    endDate: '2024-07-20',
    isTicketed: true,
    creationDetails: {
        creationUserSine: 'AFS',
        creationDate: '2024-05-19',
        creationTime: '05:09',
        userWorkPcc: 'N4PL',
        userHomePcc: 'N4PL',
        primeHostId: '1B',
    },
    contactInfo: {
        phones: [' DAC'],
    },
    travelers: [
        {
            givenName: 'MUNKY MR',
            surname: 'CHUNKY',
            type: 'ADULT',
            passengerCode: 'ADT',
            nameAssociationId: '1',
            identityDocuments: [
                {
                    documentNumber: 'BF098454',
                    documentType: 'PASSPORT',
                    expiryDate: '2024-06-28',
                    issuingCountryCode: 'BGD',
                    residenceCountryCode: 'BGD',
                    givenName: 'MUNKY',
                    surname: 'CHUNKY',
                    birthDate: '1992-06-23',
                    gender: 'MALE',
                    isPrimaryDocumentHolder: false,
                    itemId: '3a5b48d34eb2f6281a46638b5598d7adbcbe7a3bc5af4f339924f60fdc03aee95038e971e4966560c5bab9c19601914f20809663ac98fae5648eb5e913113358',
                },
                {
                    documentNumber: 'BF098454',
                    documentType: 'PASSPORT',
                    expiryDate: '2024-06-28',
                    issuingCountryCode: 'BGD',
                    residenceCountryCode: 'BGD',
                    givenName: 'HANNAN',
                    surname: 'MOLLA',
                    birthDate: '2024-03-19',
                    gender: 'MALE',
                    isPrimaryDocumentHolder: false,
                    itemId: '70b2c3fb585fbe61b0f6172fa9f30254eb15ca54513a596f41d0228040f11f57448f61002759417ba51b2a94ca5a91e794f3d09636609afbe9cbbbc497fc7a8a',
                },
            ],
        },
        {
            givenName: 'HANNAN MISS',
            surname: 'MOLLA',
            type: 'INFANT',
            passengerCode: 'INF',
            nameAssociationId: '2',
            nameReferenceCode: 'I02',
        },
    ],
    flights: [
        {
            itemId: '13',
            confirmationId: 'TVUZFH',
            sourceType: 'ATPCO',
            flightNumber: 147,
            airlineCode: 'BG',
            airlineName: 'BIMAN BANGLADESH',
            operatingFlightNumber: 147,
            operatingAirlineCode: 'BG',
            operatingAirlineName: 'BIMAN BANGLADESH',
            fromAirportCode: 'DAC',
            toAirportCode: 'DXB',
            departureDate: '2024-07-20',
            departureTime: '17:25:00',
            arrivalDate: '2024-07-20',
            arrivalTime: '22:15:00',
            numberOfSeats: 1,
            cabinTypeName: 'ECONOMY',
            cabinTypeCode: 'Y',
            aircraftTypeCode: '788',
            aircraftTypeName: 'BOEING 787-8',
            bookingClass: 'T',
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
            hiddenStopArrivalDate: '2024-07-20',
            hiddenStopArrivalTime: '18:10',
            hiddenStopDepartureDate: '2024-07-20',
            hiddenStopDepartureTime: '19:10',
            hiddenStops: [
                {
                    airportCode: 'CGP',
                    departureDate: '2024-07-20',
                    departureTime: '19:10',
                    arrivalDate: '2024-07-20',
                    arrivalTime: '18:10',
                    durationInMinutes: 60,
                },
            ],
            travelerIndices: [1, 2],
            identityDocuments: [
                {
                    itemId: '3a5b48d34eb2f6281a46638b5598d7adbcbe7a3bc5af4f339924f60fdc03aee95038e971e4966560c5bab9c19601914f20809663ac98fae5648eb5e913113358',
                    status: 'Confirmed',
                },
                {
                    itemId: '70b2c3fb585fbe61b0f6172fa9f30254eb15ca54513a596f41d0228040f11f57448f61002759417ba51b2a94ca5a91e794f3d09636609afbe9cbbbc497fc7a8a',
                    status: 'Confirmed',
                },
            ],
        },
    ],
    journeys: [
        {
            firstAirportCode: 'DAC',
            departureDate: '2024-07-20',
            departureTime: '17:25',
            lastAirportCode: 'DXB',
            numberOfFlights: 1,
        },
    ],
    fareRules: [
        {
            originAirportCode: 'DAC',
            destinationAirportCode: 'DXB',
            owningAirlineCode: 'BG',
            passengerCode: 'ADT',
            isRefundable: true,
            refundPenalties: [
                {
                    applicability: 'BEFORE_DEPARTURE',
                    conditionsApply: false,
                    penalty: {
                        amount: '16380',
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
                        amount: '11700',
                        currencyCode: 'BDT',
                    },
                },
            ],
        },
        {
            originAirportCode: 'DAC',
            destinationAirportCode: 'DXB',
            owningAirlineCode: 'BG',
            passengerCode: 'INF',
            isRefundable: true,
            refundPenalties: [
                {
                    applicability: 'BEFORE_DEPARTURE',
                    conditionsApply: false,
                    penalty: {
                        amount: '4095',
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
                        amount: '0',
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
                    itemId: '13',
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
            travelerIndices: [2],
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
                totalWeightInKilograms: 10,
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
    ],
    fares: [
        {
            creationDetails: {
                creationUserSine: 'AFS',
                creationDate: '2024-05-19',
                creationTime: '05:11',
                purchaseDeadlineDate: '2024-07-13',
                purchaseDeadlineTime: '23:59',
                userWorkPcc: 'N4PL',
                userHomePcc: 'N4PL',
            },
            airlineCode: 'BG',
            fareCalculationLine: 'DAC BG DXB200.00NUC200.00END ROE1.00',
            isNegotiatedFare: false,
            travelerIndices: [1],
            fareConstruction: [
                {
                    fareBasisCode: 'TBDAPO',
                    baseRate: {
                        amount: '200.00',
                        currencyCode: 'NUC',
                    },
                    isCurrentItinerary: true,
                    checkedBaggageAllowance: {
                        totalWeightInKilograms: 30,
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
                        amount: '426',
                        currencyCode: 'BDT',
                    },
                },
                {
                    taxCode: 'ZR',
                    taxAmount: {
                        amount: '160',
                        currencyCode: 'BDT',
                    },
                },
                {
                    taxCode: 'P8',
                    taxAmount: {
                        amount: '1170',
                        currencyCode: 'BDT',
                    },
                },
                {
                    taxCode: 'P7',
                    taxAmount: {
                        amount: '1170',
                        currencyCode: 'BDT',
                    },
                },
            ],
            totals: {
                subtotal: '23400',
                taxes: '9426',
                total: '32826',
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
                creationUserSine: 'AFS',
                creationDate: '2024-05-19',
                creationTime: '05:11',
                purchaseDeadlineDate: '2024-07-13',
                purchaseDeadlineTime: '23:59',
                userWorkPcc: 'N4PL',
                userHomePcc: 'N4PL',
            },
            airlineCode: 'BG',
            fareCalculationLine: 'DAC BG DXB50.00NUC50.00END ROE1.00',
            isNegotiatedFare: false,
            travelerIndices: [2],
            fareConstruction: [
                {
                    fareBasisCode: 'TBDAPO/IN75',
                    baseRate: {
                        amount: '50.00',
                        currencyCode: 'NUC',
                    },
                    isCurrentItinerary: true,
                    checkedBaggageAllowance: {
                        totalWeightInKilograms: 10,
                    },
                },
            ],
            taxBreakdown: [
                {
                    taxCode: 'E5',
                    taxAmount: {
                        amount: '351',
                        currencyCode: 'BDT',
                    },
                },
                {
                    taxCode: 'P7',
                    taxAmount: {
                        amount: '1170',
                        currencyCode: 'BDT',
                    },
                },
                {
                    taxCode: 'P8',
                    taxAmount: {
                        amount: '1170',
                        currencyCode: 'BDT',
                    },
                },
            ],
            totals: {
                subtotal: '5850',
                taxes: '2691',
                total: '8541',
                currencyCode: 'BDT',
            },
            pricingTypeCode: 'S',
            pricingTypeName: 'System',
            pricingStatusCode: 'A',
            pricingStatusName: 'Active',
            requestedTravelerType: 'INF',
            pricedTravelerType: 'INF',
            recordTypeCode: 'PQ',
            recordTypeName: 'Price Quote',
            recordId: '2',
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
            id: '13',
            type: 'FLIGHT',
            text: '147',
            vendorCode: 'BG',
            startDate: '2024-07-20',
            startTime: '17:25:00',
            startLocationCode: 'DAC',
            endDate: '2024-07-20',
            endTime: '22:15:00',
            endLocationCode: 'DXB',
        },
    ],
    flightTickets: [
        {
            number: '9976651872306',
            date: '2024-05-19',
            agencyIataNumber: '42343862',
            travelerIndex: 1,
            flightCoupons: [
                {
                    itemId: '13',
                    couponStatus: 'Not Flown',
                    couponStatusCode: 'I',
                },
            ],
            payment: {
                subtotal: '23400',
                taxes: '9426',
                total: '32826',
                currencyCode: 'BDT',
            },
            ticketStatusName: 'Issued',
            ticketStatusCode: 'TE',
            ticketingPcc: 'N4PL',
            commission: {
                commissionAmount: '1638',
                currencyCode: 'BDT',
                commissionPercentage: '7.00',
            },
        },
        {
            number: '9976651872307',
            date: '2024-05-19',
            agencyIataNumber: '42343862',
            travelerIndex: 2,
            flightCoupons: [
                {
                    itemId: '13',
                    couponStatus: 'Not Flown',
                    couponStatusCode: 'I',
                },
            ],
            payment: {
                subtotal: '5850',
                taxes: '2691',
                total: '8541',
                currencyCode: 'BDT',
            },
            ticketStatusName: 'Issued',
            ticketStatusCode: 'TE',
            ticketingPcc: 'N4PL',
            commission: {
                commissionAmount: '410',
                currencyCode: 'BDT',
                commissionPercentage: '7.00',
            },
        },
    ],
    payments: {
        flightTotals: [
            {
                subtotal: '29250',
                taxes: '12117',
                total: '41367',
                currencyCode: 'BDT',
            },
        ],
        flightCurrentTotals: [
            {
                subtotal: '29250',
                taxes: '12117',
                total: '41367',
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
            message: '/P/BGD/BF098454/BGD/23JUN92/M/28JUN24/CHUNKY/MUNKY',
            statusCode: 'HK',
            statusName: 'Confirmed',
        },
        {
            travelerIndices: [1],
            code: 'DOCS',
            name: 'API-Passenger Travel Document',
            message: '/P/BGD/BF098454/BGD/19MAR24/M/28JUN24/MOLLA/HANNAN',
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
            code: 'INFT',
            name: 'Infant',
            message: '/MOLLA/HANNAN MISS/19MAR24',
            statusCode: 'KK',
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
            message: '/9976651872306C1',
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
            message: '/INF9976651872307C1',
            statusCode: 'HK',
            statusName: 'Confirmed',
        },
    ],
    accountingItems: [
        {
            fareApplicationType: 'Single Traveler',
            formOfPaymentType: 'Cash',
            airlineCode: 'BG',
            ticketNumber: '9976651872306',
            commission: {
                commissionAmount: '1638',
            },
            fareAmount: '23400',
            taxAmount: '9426',
            travelerIndices: [1],
            tariffBasisType: 'Foreign',
        },
        {
            fareApplicationType: 'Single Traveler',
            formOfPaymentType: 'Cash',
            airlineCode: 'BG',
            ticketNumber: '9976651872307',
            commission: {
                commissionAmount: '410',
            },
            fareAmount: '5850',
            taxAmount: '2691',
            travelerIndices: [2],
            tariffBasisType: 'Foreign',
        },
    ],
    timestamp: '2024-05-19T10:15:39',
    bookingSignature: '893428b7e768ef47ed2f2f8bd38a12f4a38a55d336665b8a29d5ac5b80f22d6278ccdd1ed8c35ea25fdb2435b3c9403184fcf129f9841704221a9abe85328444',
    request: {
        confirmationId: 'TWYODI',
    },
};
//# sourceMappingURL=data.js.map