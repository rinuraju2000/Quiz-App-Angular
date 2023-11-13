import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  public name: string = "";
  public questionList: any = [];
  public currentquestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  IncorrectAnswer: number = 0;
  interval$: any;
  progress: string = "0";
  isQuizCompleted:boolean=false;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.srartCounter();

  }

  getAllQuestions() {
    this.questionService.getQuestionjson().subscribe(res => {
      this.questionList = res.questions;
    })
  }

  nextQuestion() {
    this.currentquestion++;
  }

  previousQuestion() {
    this.currentquestion--;
  }

  answer(currentQno: number, option: any) {
    if(currentQno===this.questionList.length){
      this.isQuizCompleted=true;
      this.stopCounter();
    }
    if (option.correct) {

      this.points += 10;
      this.correctAnswer++;
      setTimeout(() => {
        this.currentquestion++
        this.resetCounter();
        this.getprogressPercent();
      }, 1000)
    }
    else {

      setTimeout(() => {
        this.currentquestion++;
        this.IncorrectAnswer++;
        this.resetCounter();
        this.getprogressPercent();
      }, 1000);
      this.points -= 10;
    }
  }
  srartCounter() {
    this.interval$ = interval(1000).subscribe(val => {
      this.counter--;
      if (this.counter === 0) {
        this.currentquestion++;
        this.counter = 60;
        this.points -= 10;
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe()
    }, 6000000);
  }
  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }
  resetCounter() {
    this.stopCounter();
    this.counter = 60;
    this.srartCounter();
  }
  resetQuiz() {
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.currentquestion = 0;
    this.progress = "0";
  }
  getprogressPercent() {
    this.progress = ((this.currentquestion / this.questionList.length) * 100).toString();
    return this.progress;
  }
}
