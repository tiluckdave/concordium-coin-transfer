//! # A Concordium V1 smart contract
use concordium_std::*;
use core::fmt::Debug;

// module hash - afdb12d24bcf7b2373efef9fe2908f333966cb5502bef346a0f1d21db500017c
/// Your smart contract state.
#[derive(Serialize, SchemaType, Clone)]
pub struct State {
    valid_transactions: i8,
    invalid_transactions: i8,
    total: i8,
}

/// Your smart contract errors.
#[derive(Debug, PartialEq, Eq, Reject, Serial, SchemaType)]
enum Error {
    /// Failed parsing the parameter.
    #[from(ParseError)]
    ParseParamsError,
}

/// Init function that creates a new smart contract.
#[init(contract = "count_tracker")]
fn init<S: HasStateApi>(
    _ctx: &impl HasInitContext,
    _state_builder: &mut StateBuilder<S>,
) -> InitResult<State> {
    Ok(State {valid_transactions: 0, invalid_transactions: 0, total: 0})
}

#[receive(
    contract = "count_tracker",
    name = "validincrement",
    mutable
)]
fn validincrement<S: HasStateApi>(
    _ctx: &impl HasReceiveContext,
    host: &mut impl HasHost<State, StateApiType = S>,
) -> ReceiveResult<()> {
    // Your code
    let state = host.state_mut();
    state.valid_transactions += 1;
    state.total += 1;
    Ok(())
}

#[receive(
    contract = "count_tracker",
    name = "invalidincrement",
    mutable
)]
fn invalidincrement<S: HasStateApi>(
    _ctx: &impl HasReceiveContext,
    host: &mut impl HasHost<State, StateApiType = S>,
) -> ReceiveResult<()> {
    // Your code
    let state = host.state_mut();
    state.invalid_transactions += 1;
    state.total += 1;
    Ok(())
}

/// View function that returns the content of the state.
#[receive(contract = "count_tracker", name = "view", return_value = "State")]
fn view<'a, 'b, S: HasStateApi>(
    _ctx: &'a impl HasReceiveContext,
    host: &'b impl HasHost<State, StateApiType = S>,
) -> ReceiveResult<&'b State> {
    Ok(host.state())
}