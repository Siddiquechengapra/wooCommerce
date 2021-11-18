export interface StateListT {
  code: String;
  name: String;
  state: StatesT[];
}
export interface StatesT {
  code: String;
  name: String;
}
export interface StateResponseT {
	states: StatesT
}
