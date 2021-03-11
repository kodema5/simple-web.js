// bootstrap 5 is smaller (IE not supported)
//
import 'bootstrap'

// preactJs
//
export { h, render, Component } from 'preact'
export { html } from 'htm/preact'
export { useState, useReducer, useMemo, useCallback, useRef, useContext, useEffect, useLayoutEffect, useErrorBoundary } from 'preact/hooks'

// utility functions
//
export * from './ajax'
export * from './api'
export * from './array'
export * from './fn'
export * from './id'
export * from './is'
export * from './object'
export * from './pubsub'
export * from './state'
