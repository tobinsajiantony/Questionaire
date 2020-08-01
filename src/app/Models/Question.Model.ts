
export class Question {
    constructor(public questionId : string, public question: string
        , public options: {'optionId': string, 'optionValue' : string, isAnswer: boolean}[]
        , public userValue ?: string, public isCorrect ?: boolean){
    }
     
    //properties
}

