import { ISweepstake } from '../sweepStakes/SweepStakesService';

export function isNumberStrict(num) {
    const check = num && typeof num.valueOf === 'function' ? num.valueOf() : num;
    return typeof check === 'number' && Number.isFinite(check);
}

export const mockSweepstakesCollection: ISweepstake[] = [
    {
        id: '1',
        imageCollectionURLs: [''],
        itemInfo: 'mock info',
        itemTitle: 'MOCK 1',
        numbersDrawn: [],
        purchasedTicketsList: [],
        reservedTicketsList: [1, 9, 20, 41, 7, 40],
        totalTickets: 70,
        singleTicketValue: 3000,
        type: 'ongoing'
    },
    {
        id: '2',
        imageCollectionURLs: [''],
        itemInfo: 'mock info',
        itemTitle: 'MOCK 2',
        numbersDrawn: [],
        purchasedTicketsList: [1, 2, 3, 4, 7],
        reservedTicketsList: [10, 20, 34, 40, 70, 100, 120],
        totalTickets: 200,
        singleTicketValue: 2000,
        type: 'ongoing'
    },
    {
        id: '3',
        imageCollectionURLs: [''],
        itemInfo: 'mock info',
        numbersDrawn: [],
        itemTitle: 'MOCK 3',
        purchasedTicketsList: [],
        reservedTicketsList: [20, 40, 10, 30, 70, 72, 91, 98, 39],
        totalTickets: 300,
        singleTicketValue: 4000,
        type: 'ongoing'
    }
];
