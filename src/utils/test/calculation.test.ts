import { describe, expect, test } from '@jest/globals';
import { getDurationInHour } from "../calculation";

describe('duration calculate',()=>{
    test('time span in hour',()=>{
        const startTime = "2018-06-12T19:30";
        const endTime = "2018-06-13T19:30";
        const startTimeZone = "+8";
        const endTimeZone = "+7";
    
        expect(getDurationInHour(startTime, endTime, startTimeZone, endTimeZone)).toBe(25);
    })
})
